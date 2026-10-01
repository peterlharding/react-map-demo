import {NavLink} from 'react-router';
import {Nav} from 'react-bootstrap';

const links = [
  {to: '/map-view', label: 'Map View'},
  {to: '/mapper',   label: 'Mapper'},
  {to: '/mapper2',  label: 'Mapper2'},
  {to: '/map-edit', label: 'Map Edit'}
];

export const Footer = () => (
  <footer className='pt-4'>
    <Nav variant='pills' className='justify-content-center' as='nav'>
      {links.map(({to, label}) => (
        <Nav.Item key={to}>
          <Nav.Link as={NavLink} to={to}>{label}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  </footer>
);

export default Footer;
