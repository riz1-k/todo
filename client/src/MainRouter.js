import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
//import components
import Navbar from './components/Navbar';
import Todo from './components/Todo';
import SignUp from './components/SignUp';
import Login from './components/Login';

const MainRouter = ({ history }) => {
  const checkpage = location => {
    if (location.pathname === '/' || location.pathname === '/signup') {
      return false;
    }
    return true;
  };
  const [navBar, setNavBar] = useState(checkpage(history.location));

  history.listen(location => {
    const bool = checkpage(location);
    setNavBar(bool);
  });
  return (
    <>
      {navBar && <Navbar />}
      <Switch>
        <Route exact path='/' component={Login}></Route>
        <Route exact path='/signup' component={SignUp}></Route>
        <Route exact path='/todo' component={Todo}></Route>
      </Switch>
    </>
  );
};

export default withRouter(MainRouter);
