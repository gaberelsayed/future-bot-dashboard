import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers

const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" name="HomePage" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
