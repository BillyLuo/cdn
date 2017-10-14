import * as React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {message,Badge } from 'antd';
import { Menu, Icon, Button } from 'antd';
import Header from './components/Header';
import MainMenu from './components/menu/MainMenu';
import Login from './pages/login/Login';
import Body from './pages/body/Body';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

class App extends React.Component<{}, {}> {
  click () {
    console.log('clicked')
    message.config({
      top:100,
      duration:3
    })
    message.loading(<span style={{padding:'10px 0',display:'inline-block',width:400,textAlign:'left'}}>this is asome</span>)
  }
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Login}></Route>
            <Route path="/login" component={Login}></Route>
            <Route path="/regist" component={Login}></Route>
            <Route path="/findpass" component={Login}></Route>
            <Route path="/body" component={Body}>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
