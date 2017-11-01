import * as React from 'react'
import Title from '../../components/title/Title';
import dateFormat from '../utils/DateFormat';
import {message} from 'antd';
import './css/safesettings.css';
declare var axios;

export default class SafeSettings extends React.Component<{history:any},{}>{
    constructor(props:any){
        super(props);
    }
    state = {
        CertificationStatus:1,
        email:false,
        securityQuestion:false,
        userinfo:{}
    }
    componentDidMount () {
        this.getUserInfo();
        this.getCertificationInfo();
    }
    toCertify(){
        if(this.props['history']){
            this.props['history'].push('/cdn/certification');
        }
    }
    getUserInfo(){
        let $this = this;
        const userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId;
        if (userinfo && userinfo.userId) {
            userId = userinfo.userId;
        }
        axios.get('/bizrest/bcbizuser/'+userId).then(function (res) {
            if(res.status == 406 || res.status == 401){
                alert('您的登录信息已超时，请重新登录！')
                window.location.href='/cdn/login/5'
                return;
            }
            if(res.status == 200){
                if (res.data && res.data.userId){
                    $this.setState({
                        userinfo:res.data
                    })
                }
            }
        }).catch(function (err) {
            let errMsg = err.toString();
            if (errMsg.match('401')||errMsg.match('406')){
                alert('您的登录信息已超时，请重新登录。');
                $this.props.history.push('/login');
                return;
            }
        })
    }
    getCertificationInfo() {
        let $this = this;
        const userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId;
        if (userinfo && userinfo.userId){
            userId = userinfo.userId;
        }
        if (!userinfo) {
            return;
        }
        let query = {userId};
        axios.get('/bizrest/bcbizcertifcationuser/?query=' + JSON.stringify(query)).then((res) => {
            if (res.status == 200) {
                if (res && res.data[0] && res.data[0].status){
                    this.setState({
                        CertificationStatus:res.data[0].status
                    })
                }
            }
        }).catch((err) => {
            let errMsg = err.toString();
            if (errMsg.match('401')||errMsg.match('406')){
                alert('您的登录信息已超时，请重新登录。');
                this.props.history.push('/login');
                return;
            }
        });

        axios.get('/bizrest/bcbizcertifcationorganize/?query=' + JSON.stringify(query)).then((res) => {
            if (res.status == 200) {
                if (res && res.data[0] && res.data[0].status){
                    this.setState({
                        CertificationStatus:res.data[0].status
                    })
                }
            }
        }).catch((err) => {
            message.warn('网络故障，请稍后重试。');
            let errMsg = err.toString();
            if (errMsg.match('401')||errMsg.match('406')){
                alert('您的登录信息已超时，请重新登录。');
                $this.props.history.push('/login');
                return;
            }
        })
    }
    modify(path?:string){
        if (this.props['history']){
            this.props['history'].push('/cdn/'+path);
        }
        // location.href='/cdn/'+path;
    }
    render () {
        let CertificationStatus;
        if (this.state.CertificationStatus>2){
            CertificationStatus = (
                <div style={{paddingTop:35,fontSize:14}}>
                    已认证
                </div>
            )
        }else if (this.state.CertificationStatus == 2) {
            CertificationStatus = (
                <div style={{paddingTop:35,fontSize:14}}>
                    审核中
                </div>
            )
        }else if (this.state.CertificationStatus==1) {
            CertificationStatus = (
                <div>
                    <p style={{padding:15,fontSize:14}}>未认证</p>
                    <p><a onClick={this.toCertify.bind(this)} href="javascript:;" style={{fontSize:12}}>点击去认证</a></p>
                </div>
            )
        }
        return(
            <div className="safesettings">
                <Title text="安全设置"/>
                <div style={{padding:10}}>
                    <div className="clearfix">
                        <div style={{width:'20%',float:'left',paddingTop:10}}>
                            <img src="/img/phpot.png" style={{width:80,height:80,display:'block',margin:'0 auto'}} alt=""/>
                        </div>
                        <div style={{width:'58%',padding:'0 30px',float:'left',borderLeft:'1px solid #eee',borderRight:'1px solid #eee',margin:"10px 0"}}>
                            <div className="clearfix" style={{paddingTop:10}}>
                                <p style={{width:'40%',float:'left',lineHeight:'2em',fontSize:14}}>登陆账号：{this.state.userinfo['userName']}</p>
                                <p style={{width:'60%',float:'right',lineHeihtL:'2em',fontSize:14}}>注册时间：{dateFormat(this.state.userinfo['createdTime'])}</p>
                            </div>
                            <div style={{fontSize:14,lineHeight:'4em'}}>
                                账号ID：{this.state.userinfo['userId']}
                            </div>
                        </div>
                        <div style={{width:'20%',float:'left',textAlign:'center',paddingTop:10}}>
                            {CertificationStatus}
                        </div>
                    </div>
                </div>
                <div style={{height:30,background:'rgb(247,247,247)'}}></div>
                <div style={{padding:10,fontSize:14}}>
                    <ul>
                        <li className='clearfix' style={{padding:'20px 10px',borderBottom:'1px solid #eee'}}>
                            <div style={{width:'80%',float:'left'}}>
                                <span style={{paddingRight:40}}>登录密码</span>安全性高的密码可以使账号更安全，建议您更换密码时，设置一个包含字码，符号或数字至少两项且长度超过6位的密码。
                            </div>
                            <div style={{width:'20%',float:'left',textAlign:'center'}}>
                                <span style={{marginRight:20}}>已设置</span><a onClick={this.modify.bind(this,'setpassword')} href="javascript:;">修改</a>
                            </div>
                        </li>
                        <li className='clearfix' style={{padding:'20px 10px',borderBottom:'1px solid #eee'}}>
                            <div style={{width:'80%',float:'left'}}>
                                <span style={{paddingRight:40}}>手机绑定</span>您已绑定手机（您的手机为安全手机，可以找回密码，但不能用于登录）。
                            </div>
                            <div style={{width:'20%',float:'left',textAlign:'center'}}>
                                <span style={{marginRight:20}}>已设置</span><a onClick={this.modify.bind(this,'setphone')} href="javascript:;">修改</a>
                            </div>
                        </li>
                        <li className='clearfix' style={{padding:'20px 10px',borderBottom:'1px solid #eee'}}>
                            <div style={{width:'80%',float:'left'}}>
                                <span style={{paddingRight:40}}>备用邮箱</span>备用邮箱绑定后可以用来接受泛融链发送的备用系统、营销、服务通知。
                            </div>
                            <div style={{width:'20%',float:'left',textAlign:'center'}}>
                                <span style={{marginRight:20}}>{this.state.userinfo['securityQuestion1']?"已设置":"未设置"}</span><a onClick={this.modify.bind(this,'setmail')} href="javascript:;">{this.state.userinfo['email']?"修改":"设置"}</a>
                            </div>
                        </li>
                        <li className='clearfix' style={{padding:'20px 10px',borderBottom:'1px solid #eee'}}>
                            <div style={{width:'80%',float:'left'}}>
                                <span style={{paddingRight:40}}>密保问题</span>您找回密码的方式之一。建议您设置三个容易记住，且不容易被他人获取的问题及答案，更有效的保障您的密码安全。
                            </div>
                            <div style={{width:'20%',float:'left',textAlign:'center'}}>
                                <span style={{marginRight:20}}>{this.state.userinfo['securityQuestion1']?"已设置":"未设置"}</span><a onClick={this.modify.bind(this,'setsecurity')} href="javascript:;">{this.state.userinfo['securityQuestion1']?"修改":"设置"}</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}