import React from 'react';
import {Route, Switch } from 'react-router-dom';
import './App.css';
import home from './components/home';
import createacc  from './components/createacc';
import login from './components/login'; 
import main from './components/main';

function App() {
    return (
      <main>
          <Switch>
              <Route path="/" component={home} exact />
              <Route path="/login" component={login} exact />
              <Route path="/signup" component={createacc} exact/>
              <Route path="/main" component={main} extact/>
          </Switch>
      </main>
  )
}

export default App;
