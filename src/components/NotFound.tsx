import {Link, useLocation} from 'react-router';

export const NotFound = () => {
  const {pathname} = useLocation();

  return (
    <section>
      <h1 className='text-info h2 mb-3'>Page Not Found</h1>
      <p>There is no page at <code>{pathname}</code>. Go to the <Link to='/map-view'>Map View</Link>.</p>
    </section>
  );
};

export default NotFound;
