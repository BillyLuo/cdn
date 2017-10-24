import * as React from 'react';

export default class LoginHead extends React.Component<{history?:any,active?:string},{}>{
    constructor(props:any){
        super(props)
    }
    state = {
        loginClass:'',
        createClass:'active'
    }
    componentDidMount(){
        if (this.props.active == 'login'){
            this.setState({
                loginClass:'',
                createClass:'active'
            })
        }else {
            this.setState({
                loginClass:'active',
                createClass:''
            })
        }
    }
     //注册
     register() {
        this.setState({
            loginClass:'active',
            createClass:''
        })
        if (this.props.history) {
            this.props.history.push('/register');
        }
    }
    //去注册
    tologin () {
        this.setState({
            loginClass:'',
            createClass:'active'
        })
        if(this.props.history){
            this.props.history.push('/login');
        } 
    }
    render () {
        return (
            <div className="login-header">
                <div>
                    <div className="login-header-left">
                        <img src="/img/logo1.png" alt="首页"/>
                        <span>蜂巢链</span>
                    </div>
                    <div className="login-header-right">
                        <a href="javascript:;" className={this.state.loginClass} onClick={this.tologin.bind(this)}>登录</a>
                        <a href="javascript:;" className={this.state.createClass} onClick={this.register.bind(this)}>创建您的ID</a>
                    </div>
                </div>
            </div>  
        )
    }
}
