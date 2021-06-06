import React from 'react';
import PhoneAuth from './components/PhoneAuth';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Profile from './components/Profile';
import AuthProvider from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="container">
      <div className="section">
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Profile} />
              <Route exact path="/auth" component={PhoneAuth} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}

export default App;
