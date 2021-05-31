import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RobotModeler from './pages/RobotModeler/RobotModeler';
import Home from './pages/Home/Home';
import Error from './pages/Error/Error';
import RobotFile from './pages/RobotCodeEditor/RobotCodeEditor';
import RobotOverview from './pages/RobotOverview/RobotOverview';
import RobotInteractionCockpit from './pages/RobotInteractionCockpit/RobotInteractionCockpit';

/**
 * @description Route component of the application
 * @category Frontend
 * @component
 */
const App = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/modeler/:robotId' component={RobotModeler} />
        <Route path='/robotcodeEditor' component={RobotFile} />
        <Route path='/robotOverview' component={RobotOverview} />
        <Route
          path='/interactionCockpit/:robotId'
          component={RobotInteractionCockpit}
        />
        <Route component={Error} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
