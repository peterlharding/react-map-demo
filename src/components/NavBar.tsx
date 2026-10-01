import {Link, NavLink} from 'react-router';
import {Container, Nav, Navbar} from 'react-bootstrap';

import {demoList} from '../app/demos';

export const NavBar = () => (
  <Navbar expand='md' className='bg-body-tertiary mb-4' collapseOnSelect>
    <Container style={{maxWidth: '1600px'}}>
      <Navbar.Brand as={Link} to='/'>React Map Demo</Navbar.Brand>
      <Navbar.Toggle aria-controls='demo-nav' />
      <Navbar.Collapse id='demo-nav'>
        <Nav as='nav' aria-label='Demos'>
          {demoList.map(({path, title}) => (
            <Nav.Link key={path} as={NavLink} to={path} eventKey={path}>{title}</Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavBar;
