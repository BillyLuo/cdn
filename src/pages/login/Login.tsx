import * as React from 'react';
import {Button,Input,Icon,Checkbox,Alert,Spin,Modal} from 'antd';
import './login.css';
import LoginHead from './loginHead';
import axios from 'axios';
axios.defaults.timeout = 10000;
var  nodeForge = require('node-forge');
export default class Login extends React.Component<{history?:any},{}>{
    constructor(props:any){
        super(props);
    }
    state = {
        username:'',
        password:'',
        loginErr:false,
        loginErrMsg:'',
        rememberPass:localStorage.getItem('rememberPass')?true:false,
        loading:false
    }
    //记住密码 
    rememberPass(){
        let rememberPass = !this.state.rememberPass;
        this.setState({
            rememberPass
        })
        if (rememberPass) {
            localStorage.setItem('rememberPass','true');
            localStorage.setItem('username',this.state.username);
        }else {
            localStorage.removeItem('rememberPass');
            localStorage.removeItem('username');
        }
    }
    componentDidMount(){
        if(localStorage.getItem('rememberPass')){
            this.setState({
                username:localStorage.getItem('username')
            })
        }else {
            this.setState({
                username:''
            })
        }
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
        this.login_in();
        // console.log('denglu--------');
        // if (this.props.history) {
        //     this.props.history.push('/cdn');
        // }
    }
    //登录主函数
    login_in () {
        let $this = this;
        let md = nodeForge.md.md5.create();
        let pwd = this.state.password;
        md.update(pwd);
        const password = md.digest().toHex();
        let user_name = this.state.username;
        let data:any = {
            user_name,
            password,
            "login_type":1,
            "menu_type":1
        }
        axios.post("/bizs/lio/pblin.do?fh=LINLIO0000000J00&resp=bd",data).then((res)=>{
            if (res.status == 401 || res.status == 406) {
                Modal.warning({
                    title: '温馨提示',
                    content: '您的登录信息已超时，请重新登录。',
                    onOk() {
                        if ($this.props.history) {
                            $this.props.history.push('/login');
                        }
                    },
                    onCancel() {
                },
                  });
                return;
            }else if(res.status == 200) {
                if (res.data && res.data.err_code == "1") {
                    sessionStorage.setItem('userinfo',JSON.stringify(res.data.user_info));
                    $this.setState({
                        loading:false,
                        loginErr:false
                    })
                    if ($this.props.history) {
                        $this.props.history.push('/uc');
                    }
                }else {
                    let msg;
                    if (res.data && res.data.msg) {
                        msg  = res.data.msg;
                    }else {
                        msg = '登录失败，请重新登录';
                    }
                    $this.setState({
                        loading:false,
                        loginErrMsg:msg,
                        loginErr:true
                    })
                }
            }
        }).catch((err)=>{
            let msg = '登录失败，请稍后重新尝试。';
            $this.setState({
                loading:false,
                loginErrMsg:msg,
                loginErr:true
            })
        })
    }
    forgetpass () {
        if (this.props.history) {
            this.props.history.push('/findpass');
        }
    }
    inputUsername (e:any) {
        this.setState({
            username:e.target.value
        })
        if (this.state.rememberPass) {
            localStorage.setItem('username',e.target.value);
        }
    }
    inputPassword(e:any) {
        this.setState({
            password:e.target.value
        })
    }
    render () {
        return (
            <div className="login-in">
                <LoginHead history={this.props.history} active="login"/>
                <div className="login-main">
                    <h1>蜂巢链</h1>
                    <h3>管理您的服务</h3>
                    <Alert showIcon style={{display:this.state.loginErr?'block':'none',color:'#e00'}} type="error" message={this.state.loginErrMsg} />
                    <Spin spinning={this.state.loading} delay={300} size="large">
                        <div className="login-input">
                            <Input onChange={this.inputUsername.bind(this)} value={this.state.username} placeholder="账号" id="username" size="large" onPressEnter={this.login.bind(this)}/>
                            <Input type="password" onChange={this.inputPassword.bind(this)} value={this.state.password} placeholder="密码" onPressEnter={this.login.bind(this)} suffix={<Icon onClick={this.login.bind(this)} style={{fontSize:'20px',cursor:'pointer'}} type="login"/>} id="password" size="large"/>
                        </div>
                        </Spin>
                    <div className="login-remember-password">
                        <label><Checkbox checked={this.state.rememberPass} onChange={this.rememberPass.bind(this)}/><span>记住我的账号</span></label>
                    </div>
                </div>
                <p onClick={this.forgetpass.bind(this)} style={{color:'rgb(182,182,182)',fontSize:'14px',textAlign:'center',cursor:'pointer',position:'absolute','bottom':'100px',width:'100%',margin:'0 auto'}}>
                    忘记密码或账号？
                </p>
            </div>
        )
    }
}