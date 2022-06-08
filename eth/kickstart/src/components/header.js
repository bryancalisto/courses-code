import { Menu } from "semantic-ui-react"

const Header = () => (
  <Menu style={{ marginTop: '1rem' }}>
    <Menu.Item>
      Crowdcoin
    </Menu.Item>

    <Menu.Menu position="right">
      <Menu.Item>
        Campaings
      </Menu.Item>

      <Menu.Item>+</Menu.Item>
    </Menu.Menu>
  </Menu>
);

export default Header;