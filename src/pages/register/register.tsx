import * as React from 'react';
import './../login/login.css';
import LoginHead from './../login/loginHead';
import { Form, Icon, Input, Button, Checkbox,Modal,message ,Popover} from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
var nodeForge = require('node-forge');
axios.defaults.timeout = 10000;

export default class Register extends React.Component<{history?:any},{}>{
    constructor(props:any) {
        super(props)
    }
    timer:any;
    state = {
        username:'',
        password:'',
        passwordRepeat:'',
        tel:'',
        code:'',//短信验证码
        resend:true,//是否允许重新发送
        sending:false,//短信是否正在发送中
        sendType:'发送',//短信验证码发送文字
        visible:false,//发送短信验证框的显示与否
        phoneValidated:false,//是否验证短信
        phoneValidateErr:'',//短信验证提示语
        agree:true,//是否同意用户协议
        usernameErr:'',//用户名输入提示语
        psdErr:'',//密码输入错误提示语
        psdRepeatErr:'',//再次输入密码时的错误提示语
        telErr:'',//手机号输入错误的时候的提示
        agreementErr:'',//服务协议错误提示
        registerErr:'',//注册错误提示语
    }
    componentDidMount () {
        console.log('000000',this.props['form']);
        this.scrollBlock();
    }
    componentWillUnmount() {
        let $this = this;
        if (this.timer){
            clearInterval($this.timer);
        }
    }
    scrollBlock(){
        let $this = this;
        let oDev:any = document.getElementById('scroll-block');
        oDev.onmousedown = (ev:any)=>{
            let oEvent = ev || event;
            let disX = oEvent['clientX'] - oDev.offsetLeft;
            let oWidth:any = document.getElementById('scroll-input')['clientWidth'];
            let iWidth = oDev['clientWidth'];
            document.onmousemove =(ev)=>{
                let scrollBg:any;
                scrollBg = document.getElementById('scroll-bg');
                ev.preventDefault();
                let oEvent = ev || event;
                let dis = oEvent['clientX'] - disX;
                oDev.style.left = dis>=oWidth - iWidth? oWidth - iWidth +'px':dis +'px';
                var scrollInput = document.getElementById('scroll-input');
                scrollBg.style.width = dis>=oWidth - iWidth? oWidth - iWidth +'px':dis +'px';
                if(dis<=0){
                    oDev.style.left = 0 + 'px';
                    scrollBg = document.getElementById('scroll-bg');
                    scrollBg.style.width = '0px';
                }
                if(dis>=oWidth - iWidth){
                    console.log(dis);
                    $this.phoneValidate();
                    oDev.style.left = dis+'px';
                    scrollBg = document.getElementById('scroll-bg');
                    scrollBg.style.width = dis+'px';
                    document.onmousemove = null;
                }
            }
            document.onmouseup = (ev)=>{
                let oEvent = ev || event;
                let dis = oEvent['clientX'] - disX;
                oDev.style.left = '0px';
                let scrollBg = document.getElementById('scroll-bg');
                if (scrollBg) {
                    scrollBg.style.width =  0 + 'px';
                    oDev.style.left = 0+'px';
                    document.onmousemove = null;
                    document.onmousedown = null;
                }
            }
        }
    }
    inputUsername(e:any){
        this.setState({
            username:e.target.value
        })
    }
    inputPassword(e:any){
        this.setState({
            password:e.target.value
        })
    }
    inputRepeatPass(e:any){
        this.setState({
            passwordRepeat:e.target.value
        })
    }
    inputPhone(e:any){
        this.setState({
            tel:e.target.value
        })
    }
    usernameBlur(){
        let username = this.state.username;
        let msg;
        if (!username){
            msg='请输入用户名';
        }else if(username.length>20 || username.length < 2){
            msg = '用户名的长度应该在2~20之间';
        }else{
            msg = '';
        }
        this.setState({
            usernameErr:msg
        })
    }
    passwordBlur(){
        let password = this.state.password;
        let msg;
        if (!password){
            msg = '请输入密码';
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
            psdErr:msg
        })
    }
    passwordRepeatBlur(){
        let password = this.state.password;
        let passwordRepeat = this.state.passwordRepeat;
        let msg;
        if(!passwordRepeat){
            msg = '请再次输入密码';
        }else if (password != passwordRepeat){
            msg = '两次密码输入不一致';
        }else {
            msg = '';
        }
        this.setState({
            psdRepeatErr:msg
        })
    }
    telBlur(){
        let tel = this.state.tel;
        let msg;
        if (!/^1[34578]\d{9}$/.test(tel)) {
            msg = '请输入正确的手机号码';
        }
        this.setState({
            telErr:msg
        })
    }
    //验证手机短信
    phoneValidate():any{
        this.usernameBlur();
        this.passwordBlur();
        this.passwordRepeatBlur();
        this.telBlur();
        let usernameErr = this.state.usernameErr;
        let psdErr = this.state.psdErr;
        let psdRepeatErr = this.state.psdRepeatErr;
        let telErr = this.state.telErr;
        let agree = this.state.agree;
        let phoneValidated = this.state.phoneValidated;
        if (usernameErr || psdErr || psdRepeatErr || telErr) {
            return false;
        }else {
            this.setState({
                visible:true
            })
            this.sendText();
        }
    }
    //请求短信验证码
    sendText():any{
        
        if (!this.state.sending) {
            this.setState({
                sending:true
            })
        }else {
            return;
        }
        if (!this.state.resend) {
            message.warn('短信已经发送');
            return;
        }
        let tel = this.state.tel;
        let $this = this;
        let num = 60;
        this.timer = setInterval(function () {
            num --;
            $this.setState({
                sendType:num+'s后重新发送',
                resend:false
            })
            if (num <=0) {
                $this.setState({
                    sendType:'重新发送',
                    resend:true,
                    sending:false
                })
                clearInterval($this.timer);
            }
        },1000)
        axios.post('/bizs/biz/pbsms.do?fh=LIOCOD0000000J00&resp=bd',{
            tel
        }).then((res)=>{
            console.log('短信发送成功',res);
            if(res && res.data && res.data.err_code == 1){
                message.success('短信发送成功');
            }else {
                message.error('短信发送失败，请稍后重试');
            }
        }).catch((err)=>{
            console.log(err,'短信发送');
            message.error('短信发送失败，请稍后重试');
        })
    }
    inputCode (e:any) {
        this.setState({
            code:e.target.value
        })
    }
    //验证短信
    submitText(){
        let $this = this;
        let input_code = this.state.code;
        axios.post('/bizs/biz/pbmcd.do?fh=REGBIZ0000000J00&resp=bd',{
            input_code
        }).then((res)=>{
            if (res && res.data && res.data.err_code == '1') {
                message.success('验证成功');
                $this.setState({
                    visible:false,
                    phoneValidated:true,
                    phoneValidateErr:''
                })
            }else {
                message.error('验证失败，请稍后重试。');
            }
        }).catch((err)=>{
            console.log('短信验证失败');
            message.error('验证失败，请稍后重试。');
        })
    }
    cancelPhoneValidate () {
        this.setState({
            visible:false
        })
    }
    //提交表单
    submitData(e:any):any{
        let $this = this;
        e.preventDefault();
        this.usernameBlur();
        this.passwordBlur();
        this.passwordRepeatBlur();
        this.telBlur();
        let usernameErr = this.state.usernameErr;
        let psdErr = this.state.psdErr;
        let psdRepeatErr = this.state.psdRepeatErr;
        let telErr = this.state.telErr;
        let agree = this.state.agree;
        let phoneValidated = this.state.phoneValidated;
        if (usernameErr || psdErr || psdRepeatErr || telErr) {
            return false;
        }else {
            if (!phoneValidated) {
                console.log('请先验证手机');
                this.setState({
                    phoneValidateErr:'请先验证手机'
                })
                return false;
            }else{
                if (!agree) {
                    this.setState({
                        agreementErr:'您还没有同意《蜂巢链网站服务协议》'
                    })
                    return false;
                }else {
                    this.setState({
                        agreementErr:''
                    })
                }
            }
        }
        console.log('提交表单',this.state.usernameErr);
        let user_name = this.state.username;
        let password = this.state.password;
        let confirm_password = this.state.passwordRepeat;
        let md = nodeForge.md.md5.create();
        md.update(password)
        md.update(confirm_password)
        password = md.digest().toHex();
        confirm_password =md.digest().toHex();
        let certification_tel = this.state.tel;
        let tel = this.state.tel;
        let data = {
            user_name,
            password,
            confirm_password,
            certification_tel,
            tel
        }
        console.log('发送的data',data);
        axios.post('/bizs/biz/pbreg.do?fh=REGBIZ0000000J00&resp=bd',data)
        .then((res)=>{
            console.log('注册',res);
            if (res && res.data) {
                if (res.data.err_code == '1') {
                    message.success('注册成功');
                    $this.setState({
                        registerErr:'',
                        visible:false,
                        phoneValidated:true
                    })
                }else {
                    message.warning(res.data.msg + ',请稍后重试');
                    $this.setState({
                        registerErr:res.data.msg + ',注册失败，请稍后重试'                     
                    })
                }
            }else {
                message.error('注册失败，请稍后重试。');
                $this.setState({
                    registerErr:res.data.msg + ',注册失败，请稍后重试'                     
                })
            }
        }).catch((err)=>{
            console.log(err);
            message.error('注册失败，请稍后重试。');
        })
    }
    changeAgreement(){
        this.setState({
            agree:!this.state.agree
        })
    }
    render () {
        return (
            <div className="register">
                <LoginHead history={this.props.history}/>
                <div className="regiser-title">
                    <div style={{fontSize:'28px',color:'#fff',textAlign:'center'}}>
                        创建蜂巢链条账号
                    </div>
                </div>
                <Form style={{width:"380px",margin:"0 auto"}} onSubmit={this.submitData.bind(this)}>
                    <FormItem required help={this.state.usernameErr} validateStatus={this.state.usernameErr?'error':'success'}>
                        <Input value={this.state.username} onBlur={this.usernameBlur.bind(this)} onChange={this.inputUsername.bind(this)} size="large" placeholder="用户名" type="text"/>
                    </FormItem>
                    <FormItem required help={this.state.psdErr} validateStatus={this.state.psdErr?'error':'success'}>
                        <Popover placement="bottom" title={
                            <div>
                                <div>您的密码必须包含:</div>
                            </div>
                    } content={
                        <div>
                            <div>只能是字母和数字或者下划线;</div>
                            <div>8~30个字符;</div>
                            <div>包含大写和小写字母;</div>
                            <div>至少一个数字。</div>
                        </div>
                    }>
                            <Input value={this.state.password} onBlur={this.passwordBlur.bind(this)} onChange={this.inputPassword.bind(this)} size="large" placeholder="密码" type="password"/>
                        </Popover>
                    </FormItem>
                    <FormItem required help={this.state.psdRepeatErr} validateStatus={this.state.psdRepeatErr?'error':'success'}>
                        <Input value={this.state.passwordRepeat} onBlur={this.passwordRepeatBlur.bind(this)} onChange={this.inputRepeatPass.bind(this)} size="large" placeholder="确认密码" type="password"/>
                    </FormItem>
                    <FormItem required help={this.state.telErr} validateStatus={this.state.telErr?'error':'success'}>
                        <Input value={this.state.tel} type="text" onBlur={this.telBlur.bind(this)} onChange={this.inputPhone.bind(this)} size="large" placeholder="手机号" />
                    </FormItem>
                    <div id="scroll-input" className='scroll-input'>
                        <div className="scroll-block-bg" id="scroll-bg"></div>
                        <div id="scroll-block" className='scroll-block'>
                            <Icon style={{color:'#aaa'}} type="double-right" />
                        </div>
                        <span style={{fontSize:'12px',color:'#aaa'}}>请按住滑块,拖动到最右边</span>
                    </div>
                    <div style={{color:'#f00',fontSize:'12px'}}>
                        {this.state.phoneValidateErr}
                    </div>
                    <div style={{marginBottom:'10px'}}>
                        <Checkbox checked={this.state.agree} onChange={this.changeAgreement.bind(this)} style={{position:'relative',top:'-1px'}}/><a href="javascript:;" style={{lineHeight:'12px',marginLeft:'10px'}}>同意《蜂巢链网站服务条款》</a>
                    </div>
                    <div style={{color:'red',fontSize:'12px',height:14,marginBottom:'25px'}}>{this.state.agreementErr}</div>
                    <div style={{margin:'10px 0'}}>
                        <Button size="large" style={{width:'100%'}} htmlType="submit" type="primary">同意条款并注册</Button>
                    </div>
                    <div style={{fontSize:'12px',color:'red',paddingTop:'10px'}}>
                        {this.state.registerErr?this.state.registerErr:''}
                    </div>
                </Form>
                <Modal
                title="短信验证"
                visible={this.state.visible}
                maskClosable={true}
                footer={null}
                onCancel={this.cancelPhoneValidate.bind(this)}
                >
                <div className="clearfix" style={{padding:'10px 0'}}>
                    <span style={{float:'left',width:'50px'}}>手机号：</span>
                    <div style={{width:'300px',float:'left'}}>{this.state.tel}</div>
                </div>
                <div className="clearfix" style={{padding:'10px 0 25px 0'}}>
                    <Input size="large" value={this.state.code} onChange={this.inputCode.bind(this)} style={{width:'300px',float:'left'}} placeholder="验证码"/>
                    <Button onClick={this.sendText.bind(this)} size="large" style={{background:'#333',fontWeight:400,width:'120px',float:'left',color:'#fff',marginLeft:'30px'}}>{this.state.sendType}</Button>
                </div>
                <div>
                    <Button onClick={this.submitText.bind(this)} size="large" style={{display:'block',width:'100%',margin:'0 auto',background:'#333',color:'#fff',fontWeight:400}}>提交</Button>
                </div>
                </Modal>
            </div>
        )
    }
}