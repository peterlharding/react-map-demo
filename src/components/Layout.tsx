import {Outlet} from 'react-router';
import {Container} from 'react-bootstrap';

import NavBar from './NavBar';

export const Layout = () => (
  <>
    <NavBar />
    <Container as='main' className='pb-4' style={{maxWidth: '1600px'}}>
      <Outlet />
    </Container>
  </>
);

export default Layout;
