import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/layout";
import factory from '../../../ethereum/factory';
import web3 from '../../../ethereum/web3';
import { useRouter } from 'next/router';

const CampaignNew = () => {
  const [minContribution, setMinContribution] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution)
        .send({ from: accounts[0] });

      router.push('/');
    } catch (e) {
      setErrorMsg(e.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMsg}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input label="wei" labelPosition="right" onChange={event => {
            setMinContribution(event.target.value);
            setErrorMsg('');
          }} />
        </Form.Field>
        <Button loading={loading} primary content="Create" />
        <Message error header="Shit!" content={errorMsg} />
      </Form>
    </Layout>
  )
};

export default CampaignNew;