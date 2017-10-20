import * as React from 'react';
import LoginHead from './../login/loginHead';
import {Input,Button,message} from 'antd';
import axios from 'axios';
var nodeForge = require('node-forge');
axios.defaults.timeout = 10000;

export default class FindPass extends React.Component<{history?:any},{}>{
    constructor(props:any) {
        super(props)
    }
    timer:any;
    state = {
        status:1,//三个步骤找回密码
        username:'',
        tel:'',//用户的手机号码
        usernameErr:'',//用户名输入错误时候的提示
        imgUrl:'',//图片验证码地址
        imgCode:'',//图片验证
        waiting:false,//是否在等待60s短信间隙
        sending:false,//是否正在发送短信验证码
        imgCodeErr:'',//图片验证错误提示语
        imgValidated:false,//是否验证了图片验证码
        usernameValidated:false,
        getCode:'重新获取验证码',
        codeErr:'',//短信验证失败提示语
        headText:'登录时遇到问题',//中间标题
        password:'',//设置新密码
        passwordErr:'',//密码提示语
        passwordRepeat:'',//重复设置新密码
        passwordRepeatErr:'',// 重复设置密码错误，
        setPasswordErr:''//提交密码时候的错误语
    }
    componentDidMount () {
        this.changeImg();
        this.inputCode();
    }
    componentWillUnmount() {
        let $this = this;
        if (this.timer){
            clearInterval($this.timer);
        }
    }
    componentDidUpdate(){
        this.inputCode();
    }
    inputCode () {
        var inputs = document.getElementsByClassName('input_code');
        if (inputs && inputs.length) {
            if (!this.state.waiting){
                if (inputs[0]['focus'] && typeof inputs[0]['focus'] == 'function'){
                    inputs[0]['focus']();
                }
            }else {
                return;
            }
            for (var i = 0;i<inputs.length;i++) {
                inputs[i]['onkeyup'] = null;
                (function (i:any){
                    inputs[i]['onkeyup'] = function (e:any) {
                        if (e.keyCode ==8){
                            if (i>=1) {
                                inputs[i]['value'] == '';
                                inputs[i-1]['focus']();
                            }
                        }else {
                            if (i <= 4) {
                                inputs[i+1]['focus']();
                            }
                        }
                    }
                })(i);
            }
        }
    }
    usernameBlur(){
        let $this = this;
        let user_name = this.state.username;
        axios.post('/bizs/biz/pbsct.do?fh=SCTBIZ0000000J00&resp=bd/',{
            user_name
        }).then((res)=>{
            if (res && res.data) {
                if (res.data && res.data.body && res.data.body.err_code == 1){
                    $this.setState({
                        usernameErr:'',
                        tel:res.data.body.certification_tel,
                        usernameValidated:true
                    })
                    if ($this.state.imgValidated){
                        $this.setState({
                            status:2
                        })
                        $this.getCode();
                    }
                }else {
                    $this.setState({
                        usernameErr:res.data.body.msg + ',请稍后重试'
                    })
                }
            }
        }).catch((err)=>{
            $this.setState({
                usernameErr:'用户信息获取出错，请稍后重试'
            })
        })
    }
    //获取图片码
    changeImg = () =>{
        const imgUrl = '/bizs/lio/pbcod.do?fh=LIOCOD0000000J00&resp=bd'
        const random = '&'+new Date().getTime();
        this.setState({
            imgUrl:imgUrl+random
        })
    }
    //获取短信验证码
    getCode() {
        let $this = this;
        if (this.state.getCode.match('后重新获取')) {
            message.warning('短信发送中，请稍后重试');
            return;
        }
        $this.setState({
            sending:true
        })
        let num = 60;
        this.timer = setInterval(function () {
            num --;
            $this.setState({
                getCode:num + 's后重新获取',
                waiting:true
            })
            if (num <=0) {
                clearInterval($this.timer);
                $this.setState({
                    getCode:'重新获取验证码',
                    waiting:false
                })
            }
        },1000)
        let tel = this.state.tel;
        axios.post('/bizs/biz/pbsms.do?fh=LIOCOD0000000J00&resp=bd',{
            tel
        }).then((res)=>{
            $this.setState({
                sending:false
            })
            if (res && res.data){
                if (res.data.err_code == 1) {
                    message.success('短信发送成功');
                    
                }else {
                    $this.setState({
                        codeErr:res.data.err_code
                    })
                }
            }
        }).catch((err)=>{
            console.log('获取短信验证码错误',err);
            message.warning('短信验证码获取错误，请稍后重试。');
            $this.setState({
                sending:false
            })
        })
    }
    inputUsername(e:any){
        this.setState({
            username:e.target.value
        })
    }
    inputImgCode(e:any){
        this.setState({
            imgCode:e.target.value
        })
    }
    inputPassword (e:any) {
        this.setState({
            password:e.target.value
        })
    } 
    inputPasswordRepeat(e:any) {
        this.setState({
            passwordRepeat:e.target.value
        })
    }
    //提交图片验证码的验证
    validateImgCode () {
        let $this = this;
        let code = this.state.imgCode;
        if (!code) {
            this.setState({
                imgCodeErr:'请输入图片验证码'
            })
            return;
        }
        axios.post('/bizs/lio/pbccd.do?fh=CCDLIO0000000J00&resp=bd',{
            code
        }).then((res)=>{
            if (res && res.data) {
                if (res.data.err_code == 1) {
                    // message.success('验证成功');
                    $this.setState({
                        imgCodeErr:'',
                        imgValidated:true
                    })
                    if (this.state.usernameErr) {
                        return;
                    }else {
                        if ($this.state.usernameValidated) {
                            $this.setState({
                                status:2
                            })
                            $this.getCode();
                        }
                    }
                }else {
                    $this.setState({
                        imgCodeErr:res.data.msg+',请稍后重试。'
                    })
                }
            }else {
                $this.setState({
                    imgCodeErr:'请求出错,请稍后重试。'
                })
            }
        }).catch((err)=>{
            $this.setState({
                imgCodeErr:'请求错误,请稍后重试。'
            })
        })
    }
    //取消找回账号密码
    cancelValidateCode() {
        if (this.props.history) {
            this.props.history.push('/login');
        }
    }
    confirmValidateCode() {
        let $this = this;
        let input_code:string = '';
        let inputs = document.getElementsByClassName('input_code');
        if (inputs && inputs.length) {
            for (var i = 0;i<inputs.length;i++) {
                input_code += inputs[i]['value'];
            }
        }
        axios.post('/bizs/biz/pbmcd.do?fh=REGBIZ0000000J00&resp=bd',{
            input_code
        }).then((res)=>{
            console.log('短信验证',res);
            if (res && res.data) {
                if (res.data.err_code == 1) {
                    $this.setState({
                        status:3,
                        headText:'设置密码'
                    })
                }else{
                    if (res.data.msg != 'null') {
                        $this.setState({
                            codeErr:res.data.msg
                        })
                    }else {
                        $this.setState({
                            codeErr:'验证失败，请稍后重试。'
                        })
                    }
                }
            }else {
                $this.setState({
                    codeErr:'验证失败，请稍后重试'
                })
            }
        }).catch((err)=>{
            $this.setState({
                codeErr:'验证失败，请稍后重试'
            })
        })
    }
    //设置密码
    setNewPassword() {
        this.validatePassword();
        this.validatePasswordRepeat();
        if (this.state.passwordErr || this.state.passwordRepeatErr){
            return;
        }
        if (!this.state.password && !this.state.passwordRepeat){
            return;
        }
        let $this = this;
        let user_name = this.state.username;
        let password = this.state.password;
        let md = nodeForge.md.md5.create();
        md.update(password)
        password = md.digest().toHex();
        axios.post('/bizs/biz/pbupw.do?fh=upwBIZ0000000J00&resp=bd',{
            user_name,password
        }).then((res)=>{
            console.log('putpassword',res);
            if (res && res.data) {
                if (res.data.err_code == 1) {
                    message.success('密码修改成功');
                    if (this.props.history) {
                        this.props.history.push('/uc');
                    }
                }else {
                    $this.setState({
                        setPasswordErr:res.data.msg+',请稍后重试。'
                    })
                }
            }else{
                $this.setState({
                    setPasswordErr:'设置失败，请稍后重试。'
                })
            }
        }).catch((err)=>{
            console.log('errrr设置密码失败',err);
            $this.setState({
                setPasswordErr:'设置失败，请稍后重试。'
            })
        })
    }
    //校验密码
    validatePassword(){
        let password = this.state.password;
        let passwordErr;
        if(!password){
            passwordErr='请输入密码'
        }else if (password && password.length < 8) {
            passwordErr = '密码不能少于8位';
        }else if (!/[A-Z]+/g.test(password) || (!/[a-z]+/g.test(password)) || (!/\d+/g.test(password))) {
            passwordErr = '密码中至少应该包含一个大写和小写字母以及一个数字'
        }else if (!(/^\w{8,30}$/).test(password)) {
            passwordErr='请按正确的格式输入密码,密码位数8-30位，只能是字母或者数字'
        }else {
            passwordErr = '';
        }
        this.setState({
            passwordErr
        })
    }
    //校验重复密码
    validatePasswordRepeat () {
        let passwordRepeat = this.state.passwordRepeat;
        let password = this.state.password;
        if (!passwordRepeat) {
            this.setState({
                passwordRepeatErr:'请再次输入密码。'
            })
        }else if(passwordRepeat != password){
            this.setState({
                passwordRepeatErr:'两次密码输入不一致。'
            })
        }else {
            this.setState({
                passwordRepeatErr:''
            })
        }
    }
    getBody():any {
        let status = this.state.status;
        if (status == 1) {
            return (
                <div>
                    <div style={{fontSize:'22px',paddingTop:'40px',textAlign:'center',color:'#282828'}}>
                        输入您的蜂巢链账户ID即可开始
                    </div>
                    <div style={{fontSize:'16px',padding:'20px 0 40px 0',textAlign:'center',color:'#282828'}}>
                        重设您忘记的密码
                    </div>
                    <div style={{width:'380px',margin:'0 auto'}}>
                        <div style={{padding:'10px 0'}}>
                            <Input size="large" onBlur={this.usernameBlur.bind(this)} placeholder='请输入您的账户ID' value={this.state.username} onChange={this.inputUsername.bind(this)}/>
                        </div>
                        <div style={{fontSize:'12px',color:'#f00'}}>
                            {this.state.usernameErr}
                        </div>
                        <div className="clearfix" style={{padding:'10px 0'}}>
                            <div className="clearfix">
                                <div className="clearfix">
                                    <img src={this.state.imgUrl} alt="验证码" style={{width:'100px',height:'50px',float:'left'}}/>
                                    <div style={{width:'250px',marginLeft:'30px',float:'left'}}>
                                        <Input onPressEnter={this.validateImgCode.bind(this)} size="large" value={this.state.imgCode} onChange={this.inputImgCode.bind(this)}/>
                                        <div style={{padding:'8px',textAlign:'center'}}><a onClick={this.changeImg.bind(this)} href="javascript:;">看不清楚，换一张</a></div>
                                    </div>
                                    <div style={{fontSize:'12px',color:'#f00'}}>
                                        {this.state.imgCodeErr}
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={this.validateImgCode.bind(this)} size='large' style={{fontWeight:400,display:'block',width:'100%',marginTop:'30px'}} type="primary">继续</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else if (status == 2) {
            return (
                <div style={{color:'#282828'}}>
                    <div style={{textAlign:'center',paddingTop:'40px',fontSize:'22px',color:'#282828'}}>
                        验证码
                    </div>
                    <div style={{paddingTop:'20px',textAlign:'center',fontSize:'16px'}}>
                        包含验证码的短信已发送至{this.state.tel}
                    </div>
                    <div style={{padding:'20px 0',fontSize:'16px',textAlign:'center'}}>
                        在此输入验证码
                    </div>
                    <div style={{width:'308px',margin:'10px auto'}}>
                        <Input className="input_code" maxLength="1" id="str1" size="large" style={{display:'inline-block',width:'36px',height:'38px',marginRight:'15px',textAlign:'center'}}/>
                        <Input className="input_code" maxLength="1" id="str2" size="large" style={{display:'inline-block',width:'36px',height:'38px',marginRight:'15px',textAlign:'center'}}/>
                        <Input className="input_code" maxLength="1" id="str3" size="large" style={{display:'inline-block',width:'36px',height:'38px',marginRight:'15px',textAlign:'center'}}/>
                        <Input className="input_code" maxLength="1" id="str4" size="large" style={{display:'inline-block',width:'36px',height:'38px',marginRight:'15px',textAlign:'center'}}/>
                        <Input className="input_code" maxLength="1" id="str5" size="large" style={{display:'inline-block',width:'36px',height:'38px',marginRight:'15px',textAlign:'center'}}/>
                        <Input className="input_code" maxLength="1" id="str6" size="large" style={{display:'inline-block',width:'36px',height:'38px',marginRight:'15px',textAlign:'center'}}/>
                    </div>
                    <div style={{padding:'10px 0',textAlign:'center'}}>
                        <a onClick={this.getCode.bind(this)} href="javascript:;" style={{fontSize:'14px'}}>{this.state.getCode}</a>
                    </div>
                    <div className="clearfix" style={{paddingTop:'20px',width:308,margin:'0 auto'}}>
                        <div style={{width:'50%',float:'left'}}>
                            <Button onClick={this.cancelValidateCode.bind(this)} style={{display:'block',margin:'0 auto'}} size="large">取消</Button>
                        </div>
                        <div style={{width:'50%',float:'left'}}>
                            <Button onClick={this.confirmValidateCode.bind(this)} style={{display:'block',margin:'0 auto'}} size="large" type="primary">确定</Button>
                        </div>
                    </div>
                    <div style={{fontSize:'12px',width:'308px',margin:'0 auto',padding:'20px',textAlign:'center',color:'#f00'}}>
                        {this.state.codeErr}
                    </div>
                </div>
            )
        }else if (status == 3) {
            let $this = this;
            return (
                <div>
                    <div style={{width:'310px',margin:'0 auto',paddingTop:'100px'}}>
                        <div style={{padding:'5px 0'}}>
                            <Input type="password" onBlur={this.validatePassword.bind(this)} onChange={this.inputPassword.bind(this)} size="large" placeholder="新密码" value={this.state.password}/>
                            <div style={{fontSize:'12px',color:'#f00',paddingTop:'4px',height:'12px'}}>
                                {this.state.passwordErr}
                            </div>
                        </div>
                        <div style={{padding:'5px 0'}}>
                            <Input type="password" onBlur={this.validatePasswordRepeat.bind(this)} onChange={this.inputPasswordRepeat.bind(this)} size="large" placeholder="重复新密码" value={this.state.passwordRepeat}/>
                            <div style={{fontSize:'12px',color:'#f00',paddingTop:'4px',height:'12px'}}>
                                {this.state.passwordRepeatErr}
                            </div>
                        </div>
                        <div className="clearfix" style={{paddingTop:'20px',width:308,margin:'0 auto'}}>
                            <div style={{width:'50%',float:'left'}}>
                                <Button onClick={this.cancelValidateCode.bind(this)} style={{display:'block',margin:'0 auto'}} size="large">取消</Button>
                            </div>
                            <div style={{width:'50%',float:'left'}}>
                                <Button onClick={this.setNewPassword.bind(this)} style={{display:'block',margin:'0 auto'}} size="large" type="primary">确定</Button>
                            </div>
                        </div>
                        <div style={{fontSize:'12px',color:'#f00',textAlign:'center',paddingTop:'20px'}}>
                            {this.state.setPasswordErr}
                        </div>
                    </div>
                </div>
            )
        }else {
            return;
        }
    }
    render () {
        return (
            <div className="findpass">
                <LoginHead history={this.props.history}/>
                <div style={{background:'url(/img/findpassword.png)',color:'#fff',fontSize:'38px',textAlign:'center',backgroundSize:'100% 100%',height:'90px',lineHeight:'90px'}}>
                    {this.state.headText}
                </div>
                {this.getBody()}
            </div>
        )
    }
}