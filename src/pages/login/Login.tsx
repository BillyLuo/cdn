import * as React from 'react';
import {Button} from 'antd';
export default class Login extends React.Component<{history?:any},{}>{
    constructor(props:any){
        super(props);
    }
    login() {
        console.log(this);
        if (this.props.history) {
            this.props.history.push('/body');
        }
    }
    render () {
        return (
            <div>
                这里是登录页面,<Button type="primary" onClick={this.login.bind(this)}>登录</Button>
            </div>
        )
    }
}