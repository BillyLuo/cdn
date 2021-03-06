import * as React from 'react';
import './App.css';
// import 'antd/dist/antd.css';
import {message } from 'antd';
import Login from './pages/login/Login';
import FindPass from './pages/findpass/FindPass';
import Register from './pages/register/register';
import Body from './pages/main/index';
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
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/findpass" component={FindPass} />
            <Route path="/cdn" component={Body} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
