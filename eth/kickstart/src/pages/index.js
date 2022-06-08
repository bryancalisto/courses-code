import React from 'react';
import factory from '../../ethereum/factory';
import { Button, Card } from 'semantic-ui-react';
import Layout from '../components/layout';

const Index = ({ campaigns }) => {
  Index.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  const renderCampaigns = () => {
    const items = campaigns.map(campAddr => ({
      header: campAddr,
      description: <a>View Campaign</a>,
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
      />
      {renderCampaigns()}
    </Layout>
  );
};

export default Index;