import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Campaign from '../../../ethereum/campaign';
import { Card, Grid } from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import ContributeForm from '../../components/contributeForm';

const CampaignShow = ({ summary, address }) => {

  CampaignShow.getInitialProps = async ({ query }) => {
    const campaign = Campaign(query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: query.address,
      summary: {
        minimunContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
      }
    };
  }

  const renderCards = () => {
    const {
      balance,
      manager,
      minimunContribution,
      requestsCount,
      approversCount,
    } = summary;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign'
      },
      {
        header: minimunContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this amount of wei'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the campaign. It must by approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have donated to the project'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ETH)',
        description: 'Amount of Ether this campaign is left to spend'
      }
    ];

    return <Card.Group items={items} style={{ overflowWrap: 'break-word' }} />;
  }

  return (
    <Layout>
      <h3>show camp:</h3>
      <Grid>
        <Grid.Column width={10}>
          {renderCards()}
        </Grid.Column>
        <Grid.Column width={6}>
          <ContributeForm address={address} />
        </Grid.Column>
      </Grid>
    </Layout>
  )
};

export default CampaignShow;