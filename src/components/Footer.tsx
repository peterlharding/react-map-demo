import {
  Link
} from "react-router-dom";

export const Footer = () => {
  return (
    <footer style={{padding: '20px', textAlign: 'center'}}>
      <p><Link to='/map-view'>Map View</Link> | <Link to='/mapper'>Mapper</Link> | <Link to='/mapper2'>Mapper2</Link> | <Link to='/map-edit'>Map Edit</Link></p>
    </footer>
  );
}

export default Footer;
