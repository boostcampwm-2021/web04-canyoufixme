import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header>
        <div className="Navbar"></div>
      </header>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact />
          <Route path="/debug" exact />
          <Redirect path="*" to="/notfound" />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
