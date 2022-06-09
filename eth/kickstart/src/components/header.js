import { Menu } from "semantic-ui-react"
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  const redirect = () => {
    router.push('/');
  }

  return (
    <Menu style={{ marginTop: '1rem' }}>
      <Menu.Item onClick={redirect}>
        Crowdcoin
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item onClick={redirect}>
          Campaings
        </Menu.Item>

        <Menu.Item>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  )
};

export default Header;