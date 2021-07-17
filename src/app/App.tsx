
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Container} from 'react-bootstrap';

import MapView from '../components/MapView';
import MapEdit from '../components/MapEdit';
import Mapper  from '../components/Mapper';
import Mapper2 from '../components/Mapper2';
import Footer  from '../components/Footer';

import './App.css';


export const App = () => {
  return (
    <Container style={{padding: "20px", maxWidth: '1600px'}}>
      <Router>
        <Switch>
          <Route path="/"                        exact component={MapView} />
          <Route path="/map-view"                exact component={MapView} />
          <Route path="/mapper"                  exact component={Mapper} /> 
          <Route path="/mapper2"                 exact component={Mapper2} /> 
          <Route path="/map-edit"                exact component={MapEdit} /> 
        </Switch>
        <Footer />
      </Router>
    </Container>
  );
}

export default App;

// Also see:
// * https://github.com/google-map-react/google-map-react/blob/master/API.md
// * https://developers.google.com/maps/documentation/javascript/using-typescript
// * http://google-map-react.github.io/google-map-react/map/main/
// * https://developers.google.com/maps/documentation/javascript/events
// * https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications
// * https://www.newline.co/fullstack-react/articles/how-to-write-a-google-maps-react-component/
// * https://storksnestblog.wordpress.com/2020/08/16/setting-up-google-maps-with-react-typescript/
//

