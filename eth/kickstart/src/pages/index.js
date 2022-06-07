import React from 'react';
import factory from '../../ethereum/factory';

const Index = ({ campaigns }) => {
  Index.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  return <h1>{campaigns}</h1>
};

export default Index;