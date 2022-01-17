import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>SIGNED IN</h1> : <h1>NOT SIGNED IN</h1>;
}

LandingPage.getInitialProps = async (context) => {
  try {
    const { data } = await buildClient(context).get('/api/users/currentuser')
    return data;
  } catch (err) {
    return {};
  }
}
export default LandingPage;