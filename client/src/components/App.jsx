import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Modeler from './pages/Modeler/Modeler';
import Home from './pages/Home/Home';
import Error from './pages/Error/Error';
import RobotFile from './pages/RobotFile/RobotFile';
import RobotOverview from './pages/RobotOverview/RobotOverview';
import RobotInteractionCockpit from './pages/RobotInteractionCockpit/RobotInteractionCockpit';

/**
 * @description route component of the application
 * @category Client
 * @component
 */
const App = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/modeler/:robotId' component={Modeler} />
        <Route path='/robotfile' component={RobotFile} />
        <Route path='/robot_overview' component={RobotOverview} />
        <Route
          path='/interaction_cockpit/:robotId'
          component={RobotInteractionCockpit}
        />
        <Route component={Error} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
