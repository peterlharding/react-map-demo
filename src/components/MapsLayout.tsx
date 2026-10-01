import {Outlet} from 'react-router';

import MapsLoader from './MapsLoader';

// Route element for the demo pages, so only they wait for the Maps API
export const MapsLayout = () => (
  <MapsLoader>
    <Outlet />
  </MapsLoader>
);

export default MapsLayout;
