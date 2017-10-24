import * as React from 'react';
import {Input,Button,message,Steps,Select} from 'antd';
import Title from '../../components/title/Title';
declare var axios;
const Step = Steps.Step;
const Option = Select.Option;
export default class SecurityQuestion extends React.Component<{},{}>{
    constructor(props:any){
        super(props);
    }
    timer:any;
    state = {
        userinfo:{},
        textCode:'',
        textCode2:'',
        getCodeText:'获取验证码',
        waitting:false,
        step:0,
        question1:'',
        question2:'',
        question3:'',
        answer1:'',
        answer2:'',
        answer3:''
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
    selectQuestion1(value){
        if (value) {
            this.setState({
                question1:value
            })
        }
    }
    selectQuestion2(value){
        if (value) {
            this.setState({
                question2:value
            })
        }
    }
    selectQuestion3(value){
        if (value) {
            this.setState({
                question3:value
            })
        }
    }
    inputAnswer1(e:any){
        this.setState({
            answer1:e.target.value
        })
    }
    inputAnswer2(e:any){
        this.setState({
            answer2:e.target.value
        })
    }
    inputAnswer3(e:any){
        this.setState({
            answer3:e.target.value
        })
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
                    if ($this.state.step == 0){
                        $this.setState({
                            step:1,
                            waitting:false
                        })
                    }else if($this.state.step == 1) {
                        $this.setPhone();
                    }
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
    //提交安全认证问题的信息
    setPhone(){
        let $this = this;
        let userId = this.state.userinfo['userId'];
        if (!userId) {
            message.error('用户信息获取失败，请稍后重试');
            return;
        }
        const data = {
            userId
        }
        axios.put('/bizrest/bcbizuser/'+userId,data).then((res)=>{
            if (res.status == 200){
                if(res.data && res.data.retcode == -1){
                    $this.setState({
                        step:2
                    })
                }else {
                    message.error('手机号码更改失败，请稍后重试。');
                }
            }else {
                message.error('手机号码更改失败，请稍后重试。');
            }
        }).catch((err)=>{
            message.error('手机号码更改失败，请稍后重试。');
            console.log(err);
        });
    }
    validate() {
        let maxLength = 20;
        let securityQuestion1 = this.state.question1;
        let securityQuestion2 = this.state.question2;
        let securityQuestion3 = this.state.question3; 
        let securityAnswer1 = this.state.answer1;
        let securityAnswer2 = this.state.answer2;
        let securityAnswer3 = this.state.answer3;
        if (securityQuestion1 && !securityAnswer1){
            message.warn('请输入问题1答案。');
            return ;
        }
        if (securityQuestion2 && !securityAnswer2){
            message.warn('请输入问题2答案。');
            return ;
        }
        if (securityQuestion3 && !securityAnswer3){
            message.warn('请输入问题3答案。');
            return ;
        }
        if (securityQuestion1 || securityQuestion2 || securityQuestion3){

        }else {
            message.warn('请至少选择一个问题。');
            return;
        }
        if (securityAnswer1.length>=maxLength){
            message.warn('问题1的答案不应超过'+maxLength+'个字。');
            return;
        }
        if (securityAnswer2.length>=maxLength){
            message.warn('问题2的答案不应超过'+maxLength+'个字。');
            return;
        }
        if (securityAnswer3.length>=maxLength){
            message.warn('问题3的答案不应超过'+maxLength+'个字。');
            return;
        }
        let data = {
            securityQuestion1,
            securityQuestion2,
            securityQuestion3,
            securityAnswer1,
            securityAnswer2,
            securityAnswer3
        }
        console.log('data----',data);
        this.submitData(data);
    }
    submitData(data){
        let $this = this;
        let userId = this.state.userinfo['userId'];
        if (!userId){
            message.error('网络故障，请尝试重新登录后重试。');
            return;
        }  
        axios.put('/bizrest/bcbizuser/'+userId,data).then((res)=>{
            if (res && res.data && res.data.retcode == -1) {
                message.success('安全问题提交成功。')
                    $this.setState({
                        step:2
                    })
            }else{
                message.warn('安全问题提交失败，请稍后重试。');
            }
        }).catch((err)=>{
            message.warn('安全问题提交失败，请稍后重试。');
        })  
    }
    confirm(){
        if (this.state.step == 1){
            this.validate();
        }else if (this.state.step == 2) {
            if (this.props['history']){
                this.props['history'].push('/cdn/safesettings');
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

                        <div style={{padding:'100px 0 0 0'}}>
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
                    <div>
                        <div>
                            <Select size="large" style={{width:'100%'}} onChange={this.selectQuestion1.bind(this)}>
                                <Option value="您的小学叫什么？">您的小学叫什么？</Option>
                                <Option value="您初中班主任的名字？">您初中班主任的名字？</Option>
                                <Option value="您的车牌号是什么？">您的车牌号是什么？</Option>
                                <Option value="您最希望去的地方是？">您最希望去的地方是？</Option>
                            </Select>
                            <div style={{margin:'20px 0'}}>
                                <Input placeholder="问题1答案" value={this.state.answer1} onChange={this.inputAnswer1.bind(this)}/>
                            </div>
                        </div>
                        <div>
                            <Select size="large" style={{width:'100%'}} onChange={this.selectQuestion2.bind(this)}>
                                <Option value="您最喜欢的颜色？">您最喜欢的颜色？</Option>
                                <Option value="您高中班主任的名字？">您高中班主任的名字？</Option>
                                <Option value="您小学班主任的名字？">您小学班主任的名字？</Option>
                                <Option value="您最喜欢吃的一道菜是？">您最喜欢吃的一道菜是？</Option>
                            </Select>
                            <div style={{margin:'20px 0'}}>
                                <Input placeholder="问题2答案" value={this.state.answer2} onChange={this.inputAnswer2.bind(this)}/>
                            </div>
                        </div>
                        <div>
                            <Select size="large" style={{width:'100%'}} onChange={this.selectQuestion3.bind(this)}>
                                <Option value="您的家乡在哪儿？">您的家乡在哪儿？</Option>
                                <Option value="您少年时代最喜欢的歌手的名字是？">您少年时代最喜欢的歌手的名字是？</Option>
                                <Option value="您最喜欢的球队是？">您最喜欢的球队是？</Option>
                                <Option value="您最喜欢的一部电影是？">您最喜欢的一部电影是？</Option>
                            </Select>
                            <div style={{margin:'20px 0'}}>
                                <Input placeholder="问题3答案" value={this.state.answer3} onChange={this.inputAnswer3.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div style={{padding:'20px 0'}}>
                        <Button onClick={this.confirm.bind(this)} type="primary" size="large" style={{display:'block',width:'100%'}}>确认</Button>
                    </div>
                </div>
            )
        }else if (this.state.step == 2) {
            return (
                <div>
                    <div style={{width:600,margin:'0 auto',textAlign:'center',paddingTop:30,minHeight:400}}>
                        <div style={{padding:50}}>
                            <p style={{textAlign:'center',fontSize:'14px'}}>安全问题设置成功</p>
                        </div>
                        <div>
                            <Button onClick={this.confirm.bind(this)} type="primary" style={{display:'block',width:400,margin:'0 auto'}} size="large">确认</Button>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="set-password" style={{background:'#f7f7f7',height:'calc(100vh - 50px)'}}>
                <Title text="设置安全手机" />
                <div style={{margin:'0 20px',background:'#ffffff'}}>
                    <div style={{padding:"30px 20px",background:'#fff'}}>
                        <Steps progressDot current={this.state.step}>
                            <Step description="验证身份"></Step>
                            <Step description="设置安全问题"></Step>
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