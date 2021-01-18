import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Modeler from './pages/Modeler';
import Home from './pages/Home';
import Error from './pages/Error';
import RobotFile from './pages/RobotFile';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/modeler' component={Modeler} />
            <Route path='/robotfile' component={RobotFile} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
