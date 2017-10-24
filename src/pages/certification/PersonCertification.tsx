import * as React from 'react';
import Title from '../../components/title/Title';
import {Input,Upload,Icon,message,Button,Spin} from 'antd';
import UploadImg from './UploadImg';
import axios from 'axios';
axios.defaults.timeout = 10000;

export default class PersonCertification extends React.Component<{},{
    realName:string,idNumber:string,imgUrl:string,textCode:string,getCodeText:string,waitting:boolean
    userinfo:any,status:any,spinning:boolean,reCertify:boolean
}>{
    
    constructor(props:any) {
        super(props);
        this.state = {
            userinfo:{},
            realName:'',
            status:1,//认证状态1，未审核，2 审核中  3.审核通过 4.审核不通过
            idNumber:'',
            imgUrl:'',
            textCode:'',
            getCodeText:'获取验证码',
            waitting:false,
            spinning:true,
            reCertify:false//是否重新认证
        }
    }
    componentDidMount () {
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        if (userinfo) {
            this.setState({
                userinfo
            })
            this.getCertification()
        }else {
            message.warn('找不到用户信息，请您重新登录后再次尝试');
        }
        
    }
    getCertification(){
        let $this = this;
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId = userinfo.userId;
        if (!userId){
            alert('登录超时，请重新登录。');
            window.location.href = '/login';
        }
        axios.get('/bizrest/bcbizcertifcationuser/'+userId).then((res)=>{
            $this.setState({
                spinning:false
            })
            console.log(res);
            if (res.status == 200) {
                if (res && res.data && res.data.status){
                    $this.setState({
                        status:res.data.status
                    })
                }
            }else {
                message.warn('获取用户认证信息错误，请稍后重试。');
            }
        }).catch((err)=>{
            $this.setState({
                spinning:false
            })
            console.log('获取认证信息错误',err);
            message.error('获取认证信息错误，请稍后重试。');
        })
    }
    inputRealName(e:any) {
        this.setState({
            realName:e.target.value
        })
    }
    inputIdNumber(e:any) {
        this.setState({
            idNumber:e.target.value
        })
    }
    inputTextCode(e:any) {
        this.setState({
            textCode:e.target.value
        })
    }
    getFile(ret:any,file:any) {
        if (ret && ret[0]) {
            let fileId = ret[0].id;
            this.setState({
                imgUrl:fileId
            })
        }
    } 
    //获取验证码
    getCode() {
        if(this.state.waitting){
            message.success('验证码已经发送，稍后重试');
            return;
        }
        let $this = this;
        let tel = this.state.userinfo.certification_tel;
        let data = {tel};
        let time = 60;
        let timer = setInterval(function () {
            time --;
            $this.setState({
                waitting:true,
                getCodeText:time + 's后重发'
            })
            if (time <=0) {
                clearInterval(timer);
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
    validateCode(submitData) {
        let $this = this;
        let input_code = this.state.textCode;
        const data = {
            input_code
        }
        axios.post('/bizs/biz/pbmcd.do?fh=REGBIZ0000000J00&resp=bd',data)
            .then((res)=>{
                if (res && res.data && res.data.err_code == 1) {
                    // message.success('短信验证成功');
                    $this.submit(submitData);
                }else {
                    if (res.data && res.data.msg) {
                        message.warn(res.data.msg+'验证失败，请稍后重试');
                    }else{
                        message.warn('短信验证失败，请稍后重试');
                    }
                }
            }).catch((err)=>{
                message.warn('短信验证失败，请稍后重试');
            })
    }
    // 重新认证
    reCertify() {
        this.setState({
            status:1,
            reCertify:true
        })
    }
    submitData():any{
        let userId = this.state.userinfo.userId;
        let nameReg = /^([\u4e00-\u9fa5]){2,20}$/;
        const idCardreg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        if (!userId) {
            message.warning('提交失败，请重新登录后尝试');
            return;
        }
        let realName = this.state.realName;
        let idCard = this.state.idNumber;
        let status = 2;
        let idCardPhoto = this.state.imgUrl;
        if (realName && nameReg.test(realName)) {
            
        }else {
            message.warn('名字只能是汉字，且在2～20个之间');
            return false;
        }
        if (!idCardreg.test(idCard)){
            message.warn('请输入正确的身份证号码');
            return ;
        }
        if (!idCardPhoto){
            message.warn('请选择上传证件');
            return;
        }
        const submitdata={
            userId,
            realName,
            idCard,
            status,
            idCardPhoto
        }
        console.log(submitdata);
        this.validateCode(submitdata);
    }
    submit(data){
        let $this = this;
        let userId = data.userId;
        // delete data.userId;
        if (this.state.reCertify){
            axios.put('/bizrest/bcbizcertifcationuser/'+userId,data)
            .then((res)=>{
                console.log(res);
                if(res && res.data && res.data.success == 1){
                    message.success('提交成功');
                    $this.setState({
                        status:2
                    })
                }else {
                    if(res.data && res.data.msg){
                        message.warn(res.data.msg+'，请稍后重试');
                    }else{
                        message.warn('提交失败，请稍后重试');
                    } 
                }
            }).catch((err)=>{
                message.warn('提交失败');
            })
        }else {
            axios.post('/bizrest/bcbizcertifcationuser',data)
            .then((res)=>{
                console.log(res);
                if(res && res.data && res.data.success == 1){
                    message.success('提交成功');
                    $this.setState({
                        status:2
                    })
                }else {
                    if(res.data && res.data.msg){
                        message.warn(res.data.msg+'，请稍后重试');
                    }else{
                        message.warn('提交失败，请稍后重试');
                    } 
                }
            }).catch((err)=>{
                message.warn('提交失败');
            })
        }
    }
    render () {
        let userId;
        let user = JSON.parse(sessionStorage.getItem('userinfo'));
        if (user) {
            let userId = user.userId;
        }
        let that = this;
        if (this.state.spinning) {
            return (
                <div>
                    <Spin delay={200} spinning={this.state.spinning}>
                        <div style={{width:400,height:300,margin:'0 auto'}}>

                        </div>
                    </Spin>
                </div>
            )
        }
        if (this.state.status == 2) {
            return (
                <div>
                    <Title text="个人认证" />
                    <div style={{textAlign:'center',fontSize:'16px',padding:'100px'}}>
                        <p>
                            我们将在7个工作日内进行审核。
                        </p>
                        <p style={{fontSize:14,padding:30}}>
                            审核结果将通过短信方式，发送到您绑定的手机上。
                        </p>
                    </div>
                </div>
            )
        }
        if (this.state.status == 3){
            return (
                <div>
                    <Title text="个人认证" />
                    <div style={{textAlign:'center',fontSize:'16px',padding:'100px'}}>
                        <p style={{width:300,height:100,fontSize:16,margin:"0 auto",lineHeight:"100px"}}>
                            <Icon type="check" style={{color:'rgb(17,227,102)',fontSize:22}}/>恭喜您已认证通过。
                        </p>
                    </div>
                </div>
            )
        }
        if (this.state.status == 4) {
            return (
                <div>
                    <Title text="个人认证" />
                    <div style={{textAlign:'center',fontSize:'16px',padding:'100px'}}>
                        <p style={{width:400,height:100,fontSize:16,margin:"0 auto",lineHeight:"100px"}}>
                            <Icon type="exclamation-circle-o" style={{color:'#f00',fontSize:18,marginRight:10}}/>抱歉，您的认证信息未能审核通过，请您<a onClick={this.reCertify.bind(this)} href="javascript:;" style={{fontSize:14}}>重新认证</a>
                        </p>
                    </div>
                </div>
            )
        }
        return (
            <div className="personCertification">
                <Title text="个人认证" />
                <div style={{padding:10}}>
                    <div style={{fontSize:12,marginTop:10,padding: '10px 15px',color:'rgb(254, 153, 0)',background:'rgb(255, 240, 217)'}}>
                        真实的身份是区块链服务的基础，实名认证后我们将为您创建专属链身份密钥。 此密钥是泛融链提供的各项云服务需要提供身份标识的凭证。
                    </div>
                    <div style={{width:450,margin:'0 auto',paddingTop:40}}>
                        <div style={{padding:'10px 0'}}>
                            <Input size="large" value={this.state.realName} onChange={this.inputRealName.bind(this)} placeholder="您的身份证姓名"/>
                        </div>
                        <div style={{padding:'10px 0'}}>
                            <Input size="large" value={this.state.idNumber} onChange={this.inputIdNumber.bind(this)} placeholder="您的身份证号码"/>
                        </div>
                        <UploadImg getFile={this.getFile.bind(this)} instruction={<div>
                            <p>身份证上的所有信息清晰可见，必须能看见证件号。</p>
                            <p>照片需要免冠，建议未化妆，手持证件人的五官清晰可见。</p>
                            <p>照片内容真实有效，不得做任何修改。</p>
                            <p>支持.jpg,.jpeg,.bmp,.gif,大小不超过5M。</p>
                        </div>}/>
                        <div style={{margin:'0 0 10px 0',height:'32px',position:'relative'}}>
                            <Input size="large" value={this.state.textCode} onChange={this.inputTextCode.bind(this)} placeholder="验证码"/>
                            <a onClick={this.getCode.bind(this)} style={{width:'100px',display:'block',position:'absolute',top:12,height:12,lineHeight:'12px',right:4,paddingLeft:20,borderLeft:'1px solid #ccc'}}>
                                {this.state.getCodeText}
                            </a>
                        </div>
                        <Button size="large" onClick={this.submitData.bind(this)} type="primary" style={{display:'block',width:'100%',marginTop:30}}>提交</Button>
                    </div>
                </div>
            </div>
        )
    }
}