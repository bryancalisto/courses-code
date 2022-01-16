import axios from "axios";

const LandingPage = ({ color }) => {
  console.log('I am on the component', color);
  return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async () => {
  try {
    const response = await axios.get('http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser')
    return response.data;
  } catch (err) {
    return null;
  }
}
export default LandingPage;