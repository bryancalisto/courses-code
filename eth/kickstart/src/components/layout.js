import { Container } from "semantic-ui-react";
import Header from "./header";

const Layout = ({ children }) => {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  )
};

export default Layout;