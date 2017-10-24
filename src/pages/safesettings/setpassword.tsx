import * as React from 'react';
import {Input,Button,message,Steps} from 'antd';
import Title from '../../components/title/Title';
import axios from 'axios';
import nodeForge from 'node-forge';
axios.defaults.timeout = 10000;
const Step = Steps.Step;
export default class SetPassword extends React.Component<{},{}>{
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
        oldPsd:'',
        newPsd:'',
        newPsdConfirm:''
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
    inputNewPsd(e:any){
        this.setState({
            newPsd:e.target.value
        })
    }
    inputOldPsd (e:any ){
        this.setState({
            oldPsd:e.target.value
        })
    }
    inputNewPsdConfirm(e:any) {
        this.setState({
            newPsdConfirm:e.target.value
        })
    }
    //旧密码失去焦点事件
    onOldPsdBlur (){
        var oldPsd = this.state.oldPsd;
        if(!oldPsd){
            this.setState({
                oldPsdErr:'请输入旧的密码。'
            })
            return;
        }
        // else if () {
        //     this.setState({
        //         oldPsdErr:'请按正确的提示输入密码'
        //     })
        // }
        let md = nodeForge.md.md5.create();
        md.update(oldPsd);
        oldPsd = md.digest().toHex();
        if (this.state.userinfo['passwd']) {
            if (this.state.userinfo['passwd']!=oldPsd){
                this.setState({
                    oldPsdErr:'旧密码输入不正确。'
                })
            }else{
                this.setState({
                    oldPsdErr:''
                })
            }
        }
    }
    //新密码失去焦点事件
    onNewPsdBlur(){
        let password = this.state.newPsd;
        let msg;
        if (!password){
            msg = '请输入新密码';
        }else if (password && password.length < 8) {
            msg = '密码不能少于8位';
        }else if (!/[A-Z]+/g.test(password) || (!/[a-z]+/g.test(password)) || (!/\d+/g.test(password))) {
            msg = '密码中至少应该包含一个大写和小写字母以及一个数字';
        }else if (!(/^\w{8,30}$/).test(password)){
            msg = '密码只能输入字母或者数字，且长度不超过30位';
        }else {
            msg = '';
        }
        this.setState({
            newPsdErr:msg
        })
    }
    //重复密码失去焦点事件
    onNewPsdConfirmBlur(){
        let passwordConfirm = this.state.newPsdConfirm;
        let password = this.state.newPsd;
        if (password != passwordConfirm) {
            this.setState({
                newPsdConfirmErr:'两次密码输入不一致'
            })
        }else {
            this.setState({
                newPsdConfirmErr:''
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
        let $this = this;
        if (this.state['oldPsdErr'] || this.state['newPsdErr'] || this.state['newPsdConfirmErr']) {
            return;
        }else {
            if (!this.state.oldPsd || !this.state.newPsd || !this.state.newPsdConfirm) {
                this.onOldPsdBlur();
                this.onNewPsdBlur();
                this.onNewPsdConfirmBlur();
                return;
            }
            let passwd = this.state.newPsd;
            let md = nodeForge.md.md5.create();
            md.update(passwd);
            passwd = md.digest().toHex();
            let data = {passwd};
            let userId = this.state.userinfo['userId'];
            if (!userId) {
                message.error('用户信息获取出错，请稍后登录重试');
                return;
            }
            axios.put('/bizrest/bcbizuser/'+userId,data).then((res)=>{
                if (res.status == 200) {
                    if (res.data && res.data.retcode=='-1'){
                        message.success('密码修改成功');
                        $this.setState({
                            step:2
                        });
                    }else{
                        message.warning('密码更改失败，请稍后重试。');
                    }
                }
            }).catch((err)=>{
                message.error('密码更改失败，请稍后重试');
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
                        <Input type="password" size="large" value={this.state.oldPsd} onChange={this.inputOldPsd.bind(this)} onBlur={this.onOldPsdBlur.bind(this)} placeholder="旧密码"/>
                        <div style={{color:'#f00',padding:2}}>{this.state['oldPsdErr']}</div>
                    </div>
                    <div style={{padding:5}}>
                        <Input type="password" size="large" value={this.state.newPsd} onChange={this.inputNewPsd.bind(this)} onBlur={this.onNewPsdBlur.bind(this)} placeholder="新密码"/>
                        <div style={{color:'#f00',padding:2}}>{this.state['newPsdErr']}</div>
                    </div>
                    <div style={{padding:5}}>
                        <Input type="password" size="large" value={this.state.newPsdConfirm} onChange={this.inputNewPsdConfirm.bind(this)} onBlur={this.onNewPsdConfirmBlur.bind(this)} placeholder="重复新密码"/>
                        <div style={{color:'#f00',padding:2}}>{this.state['newPsdConfirmErr']}</div>
                    </div>
                    <div style={{padding:7}}>
                        <Button onClick={this.confirm.bind(this)} type="primary" style={{display:'block',width:'100%'}} size="large">确认</Button>
                    </div>
                </div>
            )
        }else if (this.state.step == 2) {
            return (
                <div>
                    <div style={{width:400,margin:'0 auto',paddingTop:30,minHeight:400}}>
                        <p style={{padding:50,textAlign:'center',fontSize:'14px'}}>密码修改成功，请牢记您的密码。</p>
                        <div>
                            <Button onClick={this.confirm.bind(this)} type="primary" style={{display:'block',width:'100%'}} size="large">确认</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="set-password" style={{background:'#f7f7f7',height:'calc(100vh - 50px)'}}>
                <Title text="修改密码" />
                <div style={{margin:'0 20px',background:'#ffffff'}}>
                    <div style={{padding:"30px 20px",background:'#fff'}}>
                        <Steps progressDot current={this.state.step}>
                            <Step description="验证身份"></Step>
                            <Step description="修改登录密码"></Step>
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