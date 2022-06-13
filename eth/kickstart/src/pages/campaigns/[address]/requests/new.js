import { useReducer } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../../components/layout";
import Campaign from '../../../../../ethereum/campaign';
import web3 from "../../../../../ethereum/web3";
import Link from 'next/link';

const initialState = {
  message: '',
  value: '',
  description: '',
  recipient: '',
  loading: false
};

const reducer = (state = {}, action) => {
  const type = action.type;

  switch (true) {
    case /loading/.test(type):
      return {
        ...state,
        loading: !state.loading
      }
    case /set_message/.test(type):
      return {
        ...state,
        message: action.payload
      }
    case /set_/.test(type):
      return {
        ...state,
        [action.type.split('_')[1]]: action.payload,
        message: ''
      }
    case /reset_/.test(type):
      return {
        ...state,
        [action.type.split('_')[1]]: ''
      }
    case /reset/.test(type):
      const newState = { ...state };

      Object.keys(newState).forEach(prop => {
        newState[prop] = '';
      });

      return newState;
    default:
      throw new Error('Unknown action type');
  }
}

const RequestsNew = ({ address }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  RequestsNew.getInitialProps = async ({ query }) => {
    return { address: query.address };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { description, value, recipient } = state;

    dispatch({ type: 'loading' });

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
        from: accounts[0]
      });
    } catch (e) {
      dispatch({ type: 'set_message', payload: e.message });
    }

    dispatch({ type: 'loading' });
  };

  return (
    <Layout>
      <h3>Create Request</h3>
      <Link href={`/campaigns/${address}/requests`}>Back</Link>
      <Form onSubmit={onSubmit} error={!!state.message}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={state.description}
            onChange={e => dispatch({ type: 'set_description', payload: e.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in ether</label>
          <Input
            value={state.value}
            onChange={e => dispatch({ type: 'set_value', payload: e.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={state.recipient}
            onChange={e => dispatch({ type: 'set_recipient', payload: e.target.value })}
          />
        </Form.Field>

        <Message error content={state.message} />
        <Button loading={state.loading} primary>Create</Button>
      </Form>

    </Layout>
  );
};

export default RequestsNew;