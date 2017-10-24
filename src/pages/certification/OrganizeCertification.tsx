import * as React from 'react';
import Title from '../../components/title/Title';
import {Input,Icon,message,Button,Spin} from 'antd';
import UploadImg from './UploadImg';
declare var axios;

export default class OrganizeCertification extends React.Component<{},{}>{
    
    constructor(props:any) {
        super(props);
    }
    state = {
        userinfo:{},
        enterpriseName:'',
        licenseCode:'',
        licensePhoto:'',
        textCode:'',//验证码
        imgUrl:'',
        getCodeText:'获取验证码',
        waitting:false,
        spinning:true,//页面刚加载是等待的loading
        organize:{},
        webRecordNumber:'',//网站备案号
        reCertify:false,//是否重新认证
        OrganizeStatus:1//企业认证状态
    }
    componentDidMount () {
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        if (userinfo) {
            this.setState({
                userinfo
            })
            this.getCertification();
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
        axios.get('/bizrest/bcbizcertifcationorganize/?query='+JSON.stringify({
            userId:userId
        })).then((res)=>{
            $this.setState({
                spinning:false
            })
            console.log(res);
            if (res.status == 200) {
                if (res && res.data && res.data[0]&& res.data[0].status){
                    let data = res.data[0];
                    $this.setState({
                        OrganizeStatus:data.status,
                        organize:data,
                        enterpriseName:data.enterpriseName,
                        licenseCode:data.licenseCode,
                        webRecordNumber:data.webRecordNumber
                    })
                }
            }else {
                message.warning('获取用户认证信息错误，请稍后重试。');
            }
        }).catch((err)=>{
            $this.setState({
                spinning:false
            })
            console.log('获取认证信息错误',err);
            message.error('获取认证信息错误，请稍后重试。');
        })
    }
    inputEnterpriseName(e:any) {
        this.setState({
            enterpriseName:e.target.value
        })
    }
    inputLicenseCode(e:any) {
        this.setState({
            licenseCode:e.target.value
        })
    }
    inputTextCode(e:any) {
        this.setState({
            textCode:e.target.value
        })
    }
    inputWebRecordNumber(e:any) {
        this.setState({
            webRecordNumber:e.target.value
        })
    }
    getFile(ret:any,file:any) {
        if (ret && ret[0]) {
            let fileId = ret[0].id;
            this.setState({
                licensePhoto:fileId
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
        let tel = this.state.userinfo['certification_tel'];
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
                        message.warn(res.data.msg+',验证失败，请稍后重试');
                    }else{
                        message.warn('短信验证失败，请稍后重试');
                    }
                }
            }).catch((err)=>{
                message.warn('短信验证失败，请稍后重试');
            })
    }
    submitData():any{
        let userId = this.state.userinfo['userId'];
        if (!userId) {
            message.warning('提交失败，请重新登录后尝试。');
            return;
        }
        let enterpriseName = this.state.enterpriseName;
        let licenseCode = this.state.licenseCode;
        let organizeId = licenseCode;
        let licensePhoto = this.state.licensePhoto;
        let webRecordNumber = this.state.webRecordNumber;
        let status = 2;
        let type = '';//认证类型
        // let idCardPhoto = this.state.imgUrl;
        if (!enterpriseName){
            message.warn('请输入企业名称。');
            return;
        }
        if (enterpriseName.length>50) {
            message.warning('企业名称不应超过50个字。');
            return;
        }
        if (!/^\d{14}(\d|X){1}$/g.test(licenseCode)) {
            message.warn('请输入正确的15位企业注册号。');
            return;
        }
        if (!licensePhoto) {
            message.warn('请上传企业营业执照。');
            return;
        }
        if (!this.state.textCode){
            message.warn('请输入验证码');
            return;
        }
        const submitdata = {
            userId,
            organizeId,
            enterpriseName,
            licenseCode,
            type,
            status,
            webRecordNumber,
            licensePhoto
        };
        this.validateCode(submitdata);
    }
    reCertify(){
        this.setState({
            reCertify:true,
            OrganizeStatus:1
        })
    }
    submit(data){
        let $this = this;
        if(this.state.reCertify) {
            console.log('puttttffff');
            if (this.state.organize && this.state.organize['organizeId']){
                let organizeId = this.state.organize['organizeId'];
                axios.put('/bizrest/bcbizcertifcationorganize/'+organizeId,data)
                .then((res)=>{
                    console.log(res);
                    if(res && res.data && res.data.success == true){
                        message.success('提交成功');
                        $this.setState({
                            OrganizeStatus:2
                        })
                    }else {
                        if(res.data && res.data.msg){
                            message.warn(res.data.msg+'，请稍后重试');
                        }else{
                            message.warn('提交失败，请稍后重试');
                        } 
                    }
                }).catch((err)=>{
                    console.log(err);
                    message.warn('提交失败，请稍后重试');
                })
            }
        }else {
            axios.post('/bizrest/bcbizcertifcationorganize',data)
            .then((res)=>{
                console.log(res);
                if(res && res.data && res.data.success == 1){
                    message.success('提交成功');
                    $this.setState({
                        OrganizeStatus:2
                    })
                }else {
                    if(res.data && res.data.msg){
                        message.warn(res.data.msg+'，请稍后重试');
                    }else{
                        message.warn('提交失败，请稍后重试');
                    } 
                }
            }).catch((err)=>{
                console.log(err);
                message.warn('提交失败，请稍后重试');
            })
        }
        
    }
    render () {
        // let that = this;
        let userId;
        let user = JSON.parse(sessionStorage.getItem('userinfo'));
        if (user) {
             userId = user.userId;
        }
        if (this.state.spinning){
            return (
                <div>
                    <Spin delay={200} spinning={this.state.spinning}>
                        <div style={{width:400,height:300,margin:'0 auto'}}>

                        </div>
                    </Spin>
                </div>
            )
        }
        if (this.state.OrganizeStatus == 2) {
            return (
                <div>
                    <Title text="实名认证-企业/政府/其他组织" />
                    <div style={{textAlign:'center',fontSize:'16px',padding:'100px'}}>
                        <p>
                            我们将在7个工作日内进行审核。
                        </p>
                        <p style={{fontSize:14,padding:'20px 0'}}>
                            审核结果将通过短信方式，发送到您绑定的手机上。
                        </p>
                    </div>
                </div>
            )
        }if (this.state.OrganizeStatus == 3) {
            return (
                <div>
                    <Title text="实名认证-企业/政府/其他组织" />
                    <div style={{fontSize:'14px',textAlign:'center',padding:'100px 0'}}>
                        <p style={{paddingBottom:'20px'}}>
                        <Icon type="check" style={{color:'rgb(17,227,102)',fontSize:20}}/>
                            您的单位已成功通过实名认证。
                        </p>
                        <p>
                            单位名称：{this.state.organize['enterpriseName']}
                        </p>
                    </div>
                </div>
            )
        }
        if (this.state.OrganizeStatus == 4) {
            return (
                <div>
                    <Title text="实名认证-企业/政府/其他组织" />
                    <div style={{textAlign:'center',fontSize:'14px',padding:'100px'}}>
                        <p>
                            抱歉，您的企业未能通过我们的审核。请您<a style={{fontSize:12}} onClick={this.reCertify.bind(this)} href="javascript:;">重新认证</a>。
                        </p>
                    </div>
                </div>
            )
        }
        return (
            <div className="personCertification">
                <Title text="实名认证-企业/政府/其他组织" />
                <div style={{padding:10}}>
                    <div style={{fontSize:12,marginTop:10,padding: '10px 15px',color:'rgb(254, 153, 0)',background:'rgb(255, 240, 217)'}}>
                        真实的身份是区块链服务的基础，实名认证后我们将为您创建专属链身份密钥。 此密钥是泛融链提供的各项云服务需要提供身份标识的凭证。
                    </div>
                    <div style={{width:450,margin:'0 auto',paddingTop:40}}>
                        <div style={{padding:'10px 0'}}>
                            <Input size="large" value={this.state.enterpriseName} onChange={this.inputEnterpriseName.bind(this)} placeholder="企业名称"/>
                        </div>
                        <div style={{padding:'10px 0'}}>
                            <Input size="large" value={this.state.licenseCode} onChange={this.inputLicenseCode.bind(this)} placeholder="营业执照注册号"/>
                        </div>
                        <div style={{padding:'10px 0'}}>
                            <Input size="large" value={this.state.webRecordNumber} onChange={this.inputWebRecordNumber.bind(this)} placeholder="网站备案号"/>
                        </div>
                        <UploadImg getFile={this.getFile.bind(this)} instruction={<div>
                            <p>请上传营业执照清晰彩色原件扫描件或数码照。</p>
                            <p>在有效期内且年检章齐全（当年成立的可无年检章）。</p>
                            <p>由中国大陆工商局或市场监督管理局颁发。</p>
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