import * as React from 'react';
import './adddomain.css';
declare var axios;
import {Input,message,Modal} from 'antd';
import Title from '../../components/title/Title';
export default class AddDomain extends React.Component<{history?:any,location?:any},any>{
    constructor(props:any) {
        super(props)
    }
    state = {
        domainId:'',
        domainName:'',
        dns:'',
        ips:[],
        domainValid:false,//domain  是否合格
        dnsValid:false//dns 是否合格
    }
    componentDidMount(){
        this.initDomain();
    }
    //初始化页面的函数
    initDomain(){
        let $this = this;
        let domainId;
        if (this.props.location.state && this.props.location.state.domainId) {
            this.setState({
                domainValid:true,
                domainId:this.props.location.state.domainId
            })
        }
        if (this.props.location.state && this.props.location.state.domainId){
            domainId = this.props.location.state.domainId;
            axios.post('/bizs/acn/pbqdm.do',{domainId}).then((res)=>{
                if (res.status == 200 ) {
                    console.log(res);
                    if (res.data && res.data.errorCode == '000000'){
                        if (res.data.domains && res.data.domains.length){
                            let domain = res.data.domains;
                            let ips = domain[0].ips?domain[0].ips:[];
                            $this.setState({
                                ips,
                                domainName:domain[0].domainName
                            })
                        }
                    }else {
                        message.error('网络请求错误，请稍后重试。');
                    }
                }
            }).catch((err)=>{
                let errMsg = err.toString();
                if(errMsg.match('401') || errMsg.match('406')){
                    alert('您的登录信息已超时，请稍后重试。');
                    location.href="/login";
                    return;
                }
                console.log('errrrr',err);
                message.error('网络请求错误，请稍后重试。');
            });
        }
        console.log(this.props);
    }
    //如果是创建域名的话
    submitData(){
        this.onDomainNameBlur();
        let $this = this;
        let ipArr = this.state.ips;
        console.log(ipArr);
        setTimeout(function() {
            let domainValid = $this.state.domainValid;
            if (!domainValid){
                return;
            }else {
                let domainName = $this.state.domainName.trim();
                console.log(domainName,ipArr);
                if (ipArr && ipArr.length){
                    let address = '';
                    for (var i = 0;i<ipArr.length;i++){
                        address += ipArr[i].ipAddress+",";
                    }
                    axios.post('/bizs/acn/pbndm.do',{
                        domainName,
                        ips:address
                    }).then((res)=>{
                        console.log('submit--new domain---',res);
                        if (res.data && res.data.errorCode == '000000'){
                            message.success('添加域名成功.');
                            $this.props.history.push('/cdn/businessmanagement')
                            return;
                        }else if (res.data && res.data.errorCode == '000002') {
                            message.warn(res.data.errorDesc+',请重新输入域名。');
                        }else{
                            message.error('添加域名失败，请稍后重试');
                        }
                    }).catch((err)=>{
                        let errMsg = err.toString();
                        if(errMsg.match('401') || errMsg.match('406')){
                            alert('您的登录信息已超时，请稍后重试。');
                            location.href="/login";
                            return;
                        }
                        message.error('添加域名失败，请稍后重试');
                    })
                }else{
                    axios.post('/bizs/acn/pbndm.do',{
                        domainName
                    }).then((res)=>{
                        if(res.data && res.data.errorCode == '000000'){
                            message.success('添加域名成功');
                            $this.props.history.push('/cdn/businessmanagement')
                            return;
                        }if(res.data && res.data.errorCode == '000002'){
                            message.warn(res.data.errorDesc+',请重新输入域名。');
                        }else{
                            message.error('----添加域名失败，请稍后重试');
                        }
                    }).catch((err)=>{
                        let errMsg = err.toString();
                        if(errMsg.match('401') || errMsg.match('406')){
                            alert('您的登录信息已超时，请稍后重试。');
                            location.href="/login";
                            return;
                        }
                        message.error('添加域名失败，请稍后重试');
                    })
                }
                // $this.props.history.push('/cdn/businessmanagement')
            }
        }, 200);
    }
    //input dns的ip
    inputDns(e:any){
        this.setState({
            dns:e.target.value
        })
    }
    inputDomainName(e:any){
        this.setState({
            domainName:e.target.value
        })
    }
    onDomainNameBlur(){
        let domain = this.state.domainName;
        domain = domain.trim();
        var reg = /^(https?:\/\/)?[a-zA-Z0-9_]+\.\w+(\.\w+){0,}$/gi;
        if (!domain){
            message.error('请填写域名。');
        }else if (!reg.test(domain)){
            message.warn('请输入合格的域名');
        }else {
            this.setState({
                domainValid:true
            })
        }
    }
    //添加按钮的操作
    add () {
        let value = this.state.dns;
        value = value.trim();
        let ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!value) {
            message.warn('请填写IP。');
            return;
        }else if (!ipReg.test(value)){
            message.warn('请填写合格的IP地址。');
            return;
        }
        //如果是有domainid的话
        if (this.state.domainId){
            let data = {ipAddress:value}
            this.configureDomain(data);
        }else {
            //如果没有domainid的话
            let data = this.state.ips;
            data.push({
                ipAddress:value
            });
            this.setState({
                ips:data,
                dns:''
            })
        }

    }
    //如果是配置IP的话
    configureDomain(data?){
        let $this = this;
        let domainValid = $this.state.domainValid;
        let domainId = this.state.domainId;
        if (!domainValid){
            return;
        }else {
            if (data && data.ipAddress){
                axios.post('/bizs/acn/pbaip.do',{
                    domainId,
                    ipAddress:data.ipAddress
                }).then((res)=>{
                    console.log('submit-----',res);
                    if (res.data && res.data.errorCode == '000000'){
                        message.success('IP地址添加成功');
                        // $this.props.history.push('/cdn/businessmanagement')
                        let ips = res.data.domain.ips;
                        $this.setState({
                            ips,
                            dns:''
                        })
                    }else{
                        message.error('IP地址添加失败，请稍后重试。');
                    }
                }).catch((err)=>{
                    console.log('err',err);
                    let errMsg = err.toString();
                    if(errMsg.match('401') || errMsg.match('406')){
                        alert('您的登录信息已超时，请稍后重试。');
                        location.href="/login";
                        return;
                    }
                    message.error('增加IP地址失败，请稍后重试');
                })
            }else{
                return;
            }
            return;
            // $this.props.history.push('/cdn/businessmanagement')
        }
    }
    //delete时候的弹出层  
    showDeleteConfirm(value,i) {
        let $this = this;
        Modal.confirm({
          maskClosable:true,
          title: '删除IP',
          content: '确定删除IP '+value.ipAddress + ' ?',
          onOk() {
            $this.delete(i);
          },
          onCancel() {
          },
        });
      }
    //删除IP
    delete(index){
        let data = this.state.ips;
        let $this = this;
        let ipId = data[index]['ipId'];
        let domainId = this.state.domainId;
        if (!domainId){
            if (data && data.length){
                data.splice(index,1);
                console.log(data);
                this.setState({
                    ips:data
                })
            }
        }else {
            axios.post('/bizs/acn/pbdip.do',{ipId,domainId}).then((res)=>{
                if (res.data && res.data.errorCode == '000000'){
                    message.success('删除IP成功');
                    if (data && data.length){
                        data.splice(index,1);
                        console.log(data);
                        $this.setState({
                            ips:data
                        })
                    }
                }else {
                    message.error('删除IP失败，请稍后重试。');
                }
            }).catch((err)=>{
                let errMsg = err.toString();
                if(errMsg.match('401') || errMsg.match('406')){
                    alert('您的登录信息已超时，请稍后重试。');
                    location.href="/login";
                    return;
                }
                console.log(err,'删除失败');
                message.error('删除IP失败，请稍后重试。');
            })
        }
    }
    setIps(){
        let data = this.state.ips;
        let $this = this;
        if (data && data.length){
            return data.map((value,index)=>{
                return (
                    <div key={index} className="delete-dns-item">
                        <Input disabled value={value.ipAddress}/><button onClick={$this.showDeleteConfirm.bind($this,value,index)}>删除</button>
                    </div>
                )
            })
        }else {
            return '';
        }
    }
    render () {
        let button;
        if (!this.state.domainId){
            button = <button onClick={this.submitData.bind(this)} style={{marginLeft:540,marginTop:40,width:100}} className="ant-btn ant-btn-primary">提交</button>
        }
        return (
            <div className="add-domain">
                <Title text="添加域名及DNS解析"/>
                <div style={{width:700}}>
                    <div style={{margin:'0 auto',marginTop:38,padding:'36px 0',width:600,borderTop:'1px solid #ddd',borderBottom:'1px solid #ddd'}}>
                        <div className="add-domain-input">
                            <span>域名</span><Input disabled={this.state.domainId?true:false} className="ant-input-error" value={this.state.domainName} onChange={this.inputDomainName.bind(this)}/>
                        </div>
                        <div className="add-dns">
                            <span>DNS解析</span>
                            <Input value={this.state.dns} onPressEnter={this.add.bind(this)} onChange={this.inputDns.bind(this)} size="large"/>
                            <button onClick={this.add.bind(this)}>添加</button>
                        </div>
                        <div className="delete-dns">
                            {this.setIps()}
                        </div>
                    </div>
                    {button}
                </div>
            </div>
        )
    }
}