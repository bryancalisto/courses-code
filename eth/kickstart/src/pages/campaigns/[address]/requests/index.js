import { useRouter } from 'next/router';
import React from 'react'
import { Button, Table, } from 'semantic-ui-react';
import Layout from '../../../../components/layout';
import Campaign from '../../../../../ethereum/campaign';
import RequestRow from '../../../../components/requestRow';
import web3 from '../../../../../ethereum/web3';

const RequestsIndex = ({ address, requests, requestCount, approversCount }) => {
  RequestsIndex.getInitialProps = async ({ query }) => {
    const campaign = Campaign(query.address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(Array(parseInt(requestCount)).fill().map((element, index) => {
      return campaign.methods.requests(index).call();
    }))
    return { address: query.address, requests, requestCount, approversCount };
  }

  const router = useRouter();

  const onApprove = async (id) => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    });
  };

  const onFinalize = async (id) => {
    const campaign = Campaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0]
    });
  };

  const renderRows = () => {
    return (requests ?? []).map((request, index) => {
      return <RequestRow
        key={index}
        id={index}
        request={request}
        address={address}
        onApprove={() => onApprove(index)}
        onFinalize={() => onFinalize(index)}
        approversCount={approversCount}
        requestCount={requestCount}
      />;
    });
  };

  return (
    <Layout>
      <h3>Requests</h3>
      <Button primary floated="right" style={{ marginBottom: 10 }} onClick={() => router.push(`/campaigns/${address}/requests/new`)}>
        Add Request
      </Button>

      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {renderRows()}
        </Table.Body>
      </Table>

      <div>Found {requestCount} requests.</div>
    </Layout>
  );
}

export default RequestsIndex;