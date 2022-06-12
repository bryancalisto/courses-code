import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";

const ContributeForm = ({ address }) => {
  const [contribution, setContribution] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether')
      });

      router.reload();
    } catch (e) {
      setErrorMsg(e.message);
      throw e;
    }

    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit} error={!!errorMsg}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          onChange={(e) => {
            setContribution(e.target.value);
            setErrorMsg('');
          }}
          value={contribution}
        />
      </Form.Field>
      <Message error header="Shit!" content={errorMsg} />
      <Button primary loading={loading}>Contribute</Button>
    </Form>
  )
};

export default ContributeForm;