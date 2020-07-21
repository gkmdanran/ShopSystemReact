import React, { Component } from 'react';

import './App.css';
import {Route,Redirect,Switch} from "react-router-dom"
import  Login from "./pages/login/Login"
import HomePage from "./pages/homepages/HomePage"

//  import Goods from "./pages/goods/Goods"


class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Redirect from="/" to="login" exact/>
          <Route path="/login" component={Login}></Route>
          <Route path="/homepage" component={HomePage}></Route>  
        </Switch>   
      </div>
    
    );
  }
}

export default App;
