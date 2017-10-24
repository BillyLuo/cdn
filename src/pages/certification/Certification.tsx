import * as React from 'react';
import Title from '../../components/title/Title';
import {Radio,Button,message,Spin} from 'antd';
const RadioGroup = Radio.Group;
import OrganizeCertification from './OrganizeCertification';
import PersonCertification from './PersonCertification';
declare var axios;

export default class Certification extends React.Component<{history?:any},{}>{
    state = {
        spinning:true,
        certificationType:1,//1.个人  2.企业／政府／组织
        person:{},
        organization:{}
    }
    constructor(props:any) {
        super(props)
    }
    componentDidMount(){
        this.getPersonCertification();
        this.getOrganizeCertification();
    }
    //获取个人认证信息
    getPersonCertification(){
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
            if (res.status == 200) {
                if (res && res.data && res.data){
                    $this.setState({
                        person:res.data
                    })
                }
            }else {
                message.warn('获取用户认证信息错误，请稍后重试。');
            }
        }).catch((err)=>{
            $this.setState({
                spinning:false
            })
            message.error('获取认证信息错误，请稍后重试。');
        })
    }
    //获取企业／组织／政府的认证信息
    getOrganizeCertification(){
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
            if (res.status == 200) {
                if (res && res.data && res.data[0]&& res.data[0].status){
                    $this.setState({
                        organization:res.data[0]
                    })
                }
            }else {
                message.warning('获取用户认证信息错误，请稍后重试。');
            }
        }).catch((err)=>{
            $this.setState({
                spinning:false
            })
            message.error('获取认证信息错误，请稍后重试。');
        })
    }
    chooseType (e:any) {
        this.setState({
            certificationType:e.target.value
        })
    }
    //去验证
    certificate() {
        let path = this.state.certificationType == 1 ?'personcertification':'organizecertification';
        if (this.props.history) {
            this.props.history.push(path);
        }
    }
    render () {
        let radioStyle={
            display: 'block',
            fontSize:'14px',
            height: '30px',
            lineHeight: '30px',
        }
        if (this.state.spinning) {
            return (
                <div>
                    <Spin delay={300} spinning={this.state.spinning}>
                        <div style={{width:400,height:300,paddingTop:100}}></div>
                    </Spin>
                </div>
            )
        }
        if (this.state.person['status']){
            return (
                <PersonCertification />
            )
        }
        if (this.state.organization['status']) {
            return (
                <OrganizeCertification />
            )
        }
        return (
            <div className="certification">
                <Title text="实名认证"/>
                <div style={{padding:'10px 20px'}}>
                    <div style={{fontSize:12,marginTop:10,padding: '10px 15px',color:'rgb(254, 153, 0)',background:'rgb(255, 240, 217)'}}>
                        由于企业用户和个人用户认证途径不同,请选认证类型后再进行下一步的认证操作。
                    </div>
                    <div style={{paddingTop:10}}>
                        <div style={{padding:'10px 0',fontSize:'12px',color:'#333'}}>
                            请选择认证类型
                        </div>
                        <div>
                            <RadioGroup onChange={this.chooseType.bind(this)} value={this.state.certificationType}>
                                <Radio style={radioStyle} value={1}>个人</Radio>
                                <Radio style={radioStyle} value={2}>企业/政府（含企业、政府、事业单位、团体、组织等）</Radio>
                            </RadioGroup>
                        </div>
                        <Button onClick={this.certificate.bind(this)} type="primary" style={{width:100,marginTop:30}}>确定</Button>
                        <p style={{paddingTop:50,fontSize:'12px',color:'#fe8383',width:'80%'}}>
                        在您实名认证后,会对您账户归属有很大影响。例如, 企业使用的帐号做个人认证后, 遇到人员变动、交接帐号、帐号欠费、或归属纠纷时, 可能会对个人/企业都产生不好的影响或带来经济损失, 后续可能也会影响您提现或者获取发票
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}