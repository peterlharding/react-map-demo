import {Outlet} from 'react-router';
import {Container} from 'react-bootstrap';

import MapsLoader from './MapsLoader';
import Footer     from './Footer';

export const Layout = () => (
  <Container className='py-4' style={{maxWidth: '1600px'}}>
    <MapsLoader>
      <Outlet />
    </MapsLoader>
    <Footer />
  </Container>
);

export default Layout;
