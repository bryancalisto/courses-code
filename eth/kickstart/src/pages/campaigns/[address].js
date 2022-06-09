import { useRouter } from 'next/router';
import Layout from '../../components/layout';

const CampaignShow = ({ address }) => {
  CampaignShow.getInitialProps = ({ query }) => {
    return { address: query.address };
  }
  const router = useRouter();

  const redirect = () => {
    router.push('/');
  }

  return (
    <Layout>
      <h3>show camp: {address}</h3>
    </Layout>
  )
};

export default CampaignShow;