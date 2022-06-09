import React from 'react';
import factory from '../../ethereum/factory';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/layout';
import { useRouter } from 'next/router';

const Index = ({ campaigns }) => {
  const router = useRouter();

  Index.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  const renderCampaigns = () => {
    const items = (campaigns ?? []).map(campAddr => ({
      header: campAddr,
      description: <a href={`/campaigns/${campAddr}`}>View Campaign</a>,
      fluid: true
    }));

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaings</h3>
      <Button
        floated="right"
        content="Create Campaign"
        primary
        icon="add"
        onClick={() => router.push('campaigns/new')}
      />
      {renderCampaigns()}
    </Layout>
  );
};

export default Index;