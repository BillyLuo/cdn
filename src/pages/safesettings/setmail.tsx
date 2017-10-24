import * as React from 'react';
import {Input,Button,message,Steps} from 'antd';
import Title from '../../components/title/Title';
import axios from 'axios';
axios.defaults.timeout = 10000;
const Step = Steps.Step;
export default class SetMail extends React.Component<{},{}>{
    constructor(props:any){
        super(props);
    }
    timer:any;
    state = {
        userinfo:{},
        textCode:'',
        getCodeText:'获取验证码',
        waitting:false,
        step:0,
        email:'',
        emailErr:'',
        isEmailValid:false//邮箱是否合格
    }
    componentDidMount() {
        this.getUserInfo();        
    }
    componentWillUnmount(){
        if (this.timer) {
            clearInterval(this.timer);
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
            if(res.status == 200){
                if (res.data && res.data.userId){
                    $this.setState({
                        userinfo:res.data
                    })
                }
            }
        }).catch(function (err) {
            message.warning('请求错误，请稍后重试');
            console.log(err)
        })
    }
    inputTextCode(e:any){
        this.setState({
            textCode:e.target.value
        })
    }
    inputEmail(e:any){
        this.setState({
            email:e.target.value
        })
    }
    onEmailBlur(){
        let email = this.state.email;
        let msg ;
        if (!email) {
            msg = '请设置您的邮箱';   
        }else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
            msg = '请设置合格的邮箱';
        }else {
            msg = '';
        }
        this.setState({
            emailErr:msg
        })
        if (!msg) {
            this.setState({
                isEmailValid:true
            })
        }
    }
    //获取验证码
    getCode() {
        let $this = this;
        if(this.state.waitting){
            message.success('验证码已经发送，稍后重试');
            return;
        }
        let tel = this.state.userinfo['certificationTel'];
        let data = {tel};
        let time = 60;
        this.timer = setInterval(function () {
            time --;
            $this.setState({
                waitting:true,
                getCodeText:time + 's后重发'
            })
            if (time <=0) {
                clearInterval($this.timer);
                $this.setState({
                    waitting:false,
                    getCodeText:'重新获取'
                });
            }
        },1000);
        axios.post('/bizs/biz/pbsms.do?fh=LIOCOD0000000J00&resp=bd',data)
            .then((res)=>{
                console.log(res);
                if (res && res.data && res.data.err_code == 1){
                    message.success('短信已发送');
                }else {
                    if (res && res.data && res.data.msg){
                        message.warn(res.data.msg+',短信发送失败，请稍后重试');
                    }else {
                        message.warn('短信发送失败，请稍后重试');
                    }
                }
            }).catch((err)=>{
                message.error('短信发送失败，请稍后重试');
            })
    }
    //校验验证码
    validateCode() {
        let $this = this;
        let input_code = this.state.textCode;
        if (!input_code) {
            message.warning('请输入短信验证码。');
            return;
        }
        const data = {
            input_code
        }
        axios.post('/bizs/biz/pbmcd.do?fh=REGBIZ0000000J00&resp=bd',data)
            .then((res)=>{
                if (res && res.data && res.data.err_code == 1) {
                    // message.success('短信验证成功');
                    $this.setState({
                        step:1
                    })
                }else {
                    if (res.data && res.data.msg!='null') {
                        message.warn(res.data.msg+'验证失败，请稍后重试');
                    }else{
                        message.warn('短信验证失败，请稍后重试');
                    }
                }
            }).catch((err)=>{
                message.warn('短信验证失败，请稍后重试');
            })
    }
    submit() {
        this.onEmailBlur();
        if (!this.state.email) {
            this.onEmailBlur();
            return;
        }else{
            if (this.state.emailErr){
                this.onEmailBlur();
                return;
            }
        }
            
        let $this = this;
        let email = this.state.email;
        let userinfo = this.state.userinfo;
        let userId;
        if (!userinfo['userId']){
            message.warn('用户信息获取错误，请重新登录后重试');
            return;
        }else {
            userId = this.state.userinfo['userId'];
            let data = {email};
            axios.put('/bizrest/bcbizuser/'+userId,data).then((res)=>{
                if (res.status == 200) {
                    if (res.data && res.data.retcode=='-1'){
                        message.success('安全邮箱设置成功');
                        $this.setState({
                            step:2
                        });
                    }else{
                        message.warning('安全邮箱设置失败，请稍后重试。');
                    }
                }
            }).catch((err)=>{
                message.error('安全邮箱设置失败，请稍后重试');
            })
        }
    }
    confirm(){
        if (this.state.step == 1){
            this.submit();
        }else if (this.state.step == 2) {
            if (this.props['history']){
                this.props['history'].push('/uc/safesettings');
            }
        }
    }
    body():any{
        if (this.state.step == 0) {
            return (
                <div>
                    <div style={{fontSize:14,paddingTop:30,width:400,minHeight:500,margin:'0 auto'}}>
                        <p style={{padding:'20px 0 10px 0'}}>手机号：{this.state.userinfo['certificationTel']}</p>
                        <div style={{margin:'10px 0',height:'32px',position:'relative'}}>
                            <Input size="large" value={this.state.textCode} onChange={this.inputTextCode.bind(this)} placeholder="验证码"/>
                            <a onClick={this.getCode.bind(this)} style={{width:'100px',display:'block',position:'absolute',top:12,height:12,lineHeight:'12px',right:4,paddingLeft:20,borderLeft:'1px solid #ccc'}}>
                                {this.state.getCodeText}
                            </a>
                        </div>

                        <div style={{padding:'10px 0'}}>
                            <Button onClick={this.validateCode.bind(this)} size="large" type="primary" style={{display:'block',width:'100%',height:'34px'}}>
                                下一步
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }else if (this.state.step == 1) {
            return (
                <div style={{width:400,margin:'0 auto',paddingTop:30,minHeight:400}}>
                    <div style={{padding:5}}>
                        <Input type="text" size="large" value={this.state.email} onChange={this.inputEmail.bind(this)} onBlur={this.onEmailBlur.bind(this)} placeholder="请输入您的邮箱"/>
                        <div style={{color:'#f00',padding:2}}>{this.state['emailErr']}</div>
                    </div>
                    <div style={{padding:7}}>
                        <Button onClick={this.confirm.bind(this)} type="primary" style={{display:'block',width:'100%'}} size="large">确认</Button>
                    </div>
                </div>
            )
        }else if (this.state.step == 2) {
            return (
                <div>
                    <div style={{width:600,margin:'0 auto',paddingTop:30,minHeight:400}}>
                        <div style={{padding:50,textAlign:'center',fontSize:'14px'}}>
                            <p>修改成功,作为您的辅助邮箱</p>
                            <p style={{fontSize:12}}>
                                该邮箱不能作为登录名使用,仅用于安全校验及必要时的紧急联系.
                            </p>
                        </div>
                        <div style={{paddingTop:20}}>
                            <Button onClick={this.confirm.bind(this)} type="primary" style={{display:'block',width:'80%',margin:'0 auto'}} size="large">确认</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="set-password" style={{background:'#f7f7f7',height:'calc(100vh - 50px)'}}>
                <Title text="设置邮箱" />
                <div style={{margin:'0 20px',background:'#ffffff'}}>
                    <div style={{padding:"30px 20px",background:'#fff'}}>
                        <Steps progressDot current={this.state.step}>
                            <Step description="验证身份"></Step>
                            <Step description="修改安全邮箱"></Step>
                            <Step title="   " description="完成"></Step>
                        </Steps>
                    </div>
                    <div style={{background:'#f7f7f7',height:40,lineHeight:'40px'}}>
                        <img src="/img/tishi.png" style={{width:24,height:24,verticalAlign:'middle',paddingRight:2}}/>确保当前账户为<span style={{color:'rgb(153,203,237)'}}>{this.state.userinfo['userId']}</span>
                    </div>
                    {this.body()}
                </div>
            </div>
        )
    }
}