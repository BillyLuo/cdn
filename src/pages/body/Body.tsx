import { Menu, Icon, Button } from 'antd';
import * as React from 'react';
import Header from './../../components/Header';
import MainMenu from './../../components/menu/MainMenu';
import Cloud from './../cloud/Cloud';
import User from './../user/User';
import Home from './../home/Home';
import Chain from './../chain/Chain';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

export default class Body extends React.Component<{},{}>{
    constructor(props:any){
        super(props);
    }
    componentDidMount() {

    }
    render () {
        return (
            <div>
                <Header prop={this.props} />
                <div>
                    <MainMenu prop={this.props}/>
                    <div style={{float:'left'}}>
                        <Switch>
                            <Route path="/body" exact component={Home}></Route>
                            <Route path="/body/home" component={Home}></Route>
                            <Route path="/body/user" component={User}></Route>
                            <Route path="/body/cloud" component={Cloud}></Route>
                            <Route path="/body/chain" component={Chain}></Route>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}