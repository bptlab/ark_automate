import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Modeler from './pages/Modeler'
import Home from './pages/Home'
import Error from './pages/Error'


class App extends Component {
  render() {
      return (
          <BrowserRouter>
            <div>
              <Switch>
                <Route path="/" component={Home} exact/>
                <Route path="/modeler" component={Modeler}/>
                <Route component={Error}/>
              </Switch>
            </div> 
          </BrowserRouter>
      );
    }
  }

export default App;