import * as React from 'react';
import {Button,Input,Icon,Checkbox,Alert,Spin} from 'antd';
import './login.css';
export default class Login extends React.Component<{history?:any},{}>{
    constructor(props:any){
        super(props);
    }
    state = {
        username:'',
        password:'',
        loginErr:false,
        loginErrMsg:'',
        loading:false
    }
    //登录
    login() {
        if (!this.state.username || !this.state.password) {
            this.setState({
                loginErr:true,
                // loading:false,
                loginErrMsg:'请输入账号或者密码'
            })
            return;
        }
        this.setState({
            loading:true
        })
        console.log(this);
        if (this.props.history) {
            this.props.history.push('/body');
        }
    }
    //注册
    regist () {
        if (this.props.history) {
            this.props.history.push('/regist');
        }
    }
    inputUsername (e:any) {
        this.setState({
            username:e.target.value
        })
    }
    inputPassword(e:any) {
        this.setState({
            password:e.target.value
        })
    }
    render () {
        return (
            <div className="login-in">
                <div className="login-header">
                    <div>
                        <div className="login-header-left">
                            <img src="/img/logo1.png" alt="首页"/>
                            <span>蜂巢链</span>
                        </div>
                        <div className="login-header-right">
                            <a href="javascript:;">登录</a>
                            <a href="javascript:;" onClick={this.regist.bind(this)}>创建您的ID</a>
                        </div>
                    </div>
                </div>
                    <div className="login-main">
                        <h1>蜂巢链</h1>
                        <h3>管理您的服务</h3>
                        <Alert showIcon style={{display:this.state.loginErr?'block':'none',color:'#e00'}} type="error" message={this.state.loginErrMsg} />
                        <Spin spinning={this.state.loading} delay={300} size="large">
                            <div className="login-input">
                                <Input onChange={this.inputUsername.bind(this)} value={this.state.username} placeholder="账号" id="username" size="large" onPressEnter={this.login.bind(this)}/>
                                <Input onChange={this.inputPassword.bind(this)} value={this.state.password} placeholder="密码" onPressEnter={this.login.bind(this)} suffix={<Icon onClick={this.login.bind(this)} style={{fontSize:'20px',cursor:'pointer'}} type="login"/>} id="password" size="large"/>
                            </div>
                         </Spin>
                        <div className="login-remember-password">
                            <label><Checkbox /><span>记住我的账号</span></label>
                        </div>
                    </div>
                <p style={{color:'rgb(182,182,182)',fontSize:'14px',textAlign:'center',cursor:'pointer',position:'absolute','bottom':'100px',width:'100%',margin:'0 auto'}}>
                    忘记密码或账号？
                </p>
            </div>
        )
    }
}