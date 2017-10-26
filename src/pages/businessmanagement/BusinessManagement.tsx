import * as React from 'react';
import './businessmanagement.css';
import {Table,Modal,message} from 'antd';
declare var axios;
import Title from '../../components/title/Title'
export default class BusinessManagement extends React.Component<{history?:any},{}>{
    constructor(props:any) {
        super(props)
    }
    state = {
        selectedDomains:[],
        selectedUrls:[],
        urlData:[],
        domainData:[],
        addUrlVisible:false,//url弹窗是否可见
        url:''
    }
    componentDidMount(){
        this.initDomainData();
        this.initUrlData();
    }
    initDomainData(){
        let $this = this;
        axios.get('/bizs/acn/pbqdm.do').then((res)=>{
            console.log(res);
            if (res.status == 200 ) {
                if (res.data && res.data.errorCode == '000000'){
                    if (res.data.domains && res.data.domains.length){
                        $this.setDomainData(res.data.domains);
                    }
                }
            }else {
                message.error('网络请求错误，请稍后重试。');
            }
        }).catch((err)=>{
            console.log('errrrr',err);
            message.error('网络请求错误，请稍后重试。');
        });
    }
    initUrlData(){
        let $this = this;
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId;
        if (userinfo && userinfo.userId){
            userId = userinfo.userId;
        }else {
            return;
        }
        let urlText = '';
        let pageNo = 1;
        let pageSize = 4;
        axios.post('/bizs/acn/pbqul.do',{
            userId,
            urlText,
            pageNo,
            pageSize
        }).then((res)=>{
            console.log('urls------',res);
            if (res.data && res.data.urls.length){
                let urlData = res.data.urls;
                $this.setState({
                    selectedUrls:[],
                    urlData
                })
            }
        }).catch((err)=>{
            console.log(err,'查询失败');
            message.error('请求url数据出现错误，请稍后重试。');
        })
    }
    setDomainData(data?){
        console.log(data); 
        let domainData=[];
        for (let i = 0,len = data.length;i<len;i++){
            let domain = data[i];
            let dns = [];
            if (data[i].ips && data[i].ips.length){
                dns = data[i].ips;
            }
            let item = {
                key:domain.domainId,
                dns:dns,
                totalhitnumber: Math.floor(Math.random()*40)+'',
                monthanalyticnumber:Math.floor(Math.random()*200)+'',
                mouthhitnumber:Math.floor(Math.random()*30)+'',
                domainName:domain.domainName,
                updateTime:domain.updateTime
            }
            domainData.push(item);
        }
        this.setState({
            domainData
        })
    }
    inputUrl(e:any){
        this.setState({
            url:e.target.value
        })
    }
    onAddConfirm () {
        this.setState({
            url:'',
            addUrlVisible:false
        })
        this.addUrlText();
    }
    addUrlText(){
        let $this = this;
        let urlText = this.state.url.trim();
        if(!urlText){
            message.error('请输入url');
            return;
        }
        axios.post('/bizs/acn/pbnul.do',{urlText}).then((res)=>{
            if (res.data && res.data.errorCode == '000000'){
                $this.initUrlData();
            }
        }).catch((err)=>{
            console.log(err,'添加url失败');
        })
    }
    onAddCancel () {
        this.setState({
            url:'',
            addUrlVisible:false
        })
    }
    addUrl(){
        this.setState({
            addUrlVisible:true
        })
    }
    //选择行
    onSelectDomainChange(keys,rows){
        this.setState({
            selectedDomains:keys
        })
    }
    onSelectDomainAll(selected,rows) {
        let keys = [];
        if (rows && rows.length) {
            for (let i = 0,len = rows.length;i<len;i++){
                if (rows[i].key){
                    keys.push(rows[i].key)
                }
            }
        }
        this.setState({
            selectedDomains:keys
        })
    }
    doDeleteDomain(){
        let $this = this;
        let selectedDomains = this.state.selectedDomains;
        let domainData = this.state.domainData;
        
        let ids = selectedDomains.join(',');
        axios.post('/bizs/acn/pbddm.do',{domainIds:ids}).then((res)=>{
            console.log(res);
            if(res.data && res.data.errorCode=='000000'){
                for (let i = 0,len = selectedDomains.length;i<len;i++){
                    let data = [];
                    for(let j = 0;j<domainData.length;j++){
                        $this.setState({
                            domainData:data,
                            selectedDomains:[]
                        })
                        if (domainData[j] && selectedDomains[i] == domainData[j].key){
                            domainData[j] = null;
                            for (let i = 0;i<domainData.length;i++){
                                if(domainData[i]){
                                    data.push(domainData[i])
                                }
                            }
                        }
                    }
                }
                message.success('删除成功。');
            }else {
                message.error('删除失败，请稍后重试。');
            }
        }).catch((err)=>{
            console.log('删除失败，，，',err);
            message.error('删除失败，请稍后重试。');
        })
        
    }
    showDeleteDomain(){
        let $this = this;
        let selectedDomains = this.state.selectedDomains;
        if (!selectedDomains.length){
            message.warn('您还没有选中任何数据行');
            return;
        }
        Modal.confirm({
            content:'确认删除所有选中行？',
            okText:'确认',
            cancelText:'取消',
            maskClosable:true,
            onOk(){
                $this.doDeleteDomain();
            }
        })
    }
    getDomainData () {
        const columns = [{
            title: '域名',
            dataIndex: 'domainName',
            key: 'domainName',
            render: text => <a href="#">{text}</a>,
          }, {
            title: 'DNS解析',
            dataIndex: 'dns',
            key: 'dns',
            render:(value)=>{
                if (value && value.splice && value.length){
                    return (
                        <div style={{maxHeight:100,overflowY:'auto'}}>
                            {value.map((v,index)=>{
                        return <div key={index + ''}>{v.ipAddress}</div>
                    })}
                        </div>
                    )
                }else {
                    return value;
                }
                
            }
          }, {
            title: '累计命中次数',
            dataIndex: 'totalhitnumber',
            key: 'totalhitnumber',
          }, {
            title: '本月解析次数',
            dataIndex: 'monthanalyticnumber',
            key: 'mnouthanalyticnumber',
          },
          {
            title: '本月命中次数',
            dataIndex: 'mouthhitnumber',
            key: 'mouthhitnumber',
          },{
            title: '服务开通时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
          }];
          let data = this.state.domainData;
          let selectedDomains = this.state.selectedDomains;
          let $this = this;
          let rowSelection = {
            selectedDomains,
            onChange: this.onSelectDomainChange.bind($this),
            onSelectAll:this.onSelectDomainAll.bind($this)
          }
          let pagination={ //分页
            total: this.state.domainData.length, //数据总数量
            pageSize: 5,  //显示几条一页
            showSizeChanger: true,  //是否显示可以设置几条一页的选项
            showQuickJumper:true,
            showTotal:()=> {  //设置显示一共几条数据
                return '共 ' + this.state.domainData.length + ' 条数据'; 
            }
        }
        return (
            <Table rowSelection={rowSelection}columns={columns} dataSource={data} pagination={pagination}/>
        )
    }
    //渲染urlData
    getUrlData(){
        const columns = [{
            title: 'URL',
            dataIndex: 'urlText',
            key: 'urlText',
            render: text => <a href="#">{text}</a>,
          }, {
            title: 'Hash值',
            dataIndex: 'urlHash',
            key: 'urlHash',
          }, {
            title: '累计命中次数',
            dataIndex: 'totalhitnumber',
            key: 'totalhitnumber',
          }, {
            title: '本月解析次数',
            dataIndex: 'monthanalyticnumber',
            key: 'mnouthanalyticnumber',
          },
          {
            title: '本月命中次数',
            dataIndex: 'mouthhitnumber',
            key: 'mouthhitnumber',
          },{
            title: '服务开通时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
          }];
          let urlData = this.state.urlData;
          let data;
          data = urlData.map((value,index)=>{
            return {
                key:value.urlId,
                urlText:value.urlText,
                urlHash:value.urlHash,
                totalhitnumber: Math.floor(Math.random()*40)+'',
                monthanalyticnumber:Math.floor(Math.random()*200)+'',
                mouthhitnumber:Math.floor(Math.random()*30)+'',
                updateTime:value.updateTime
            }
          })
          let selectedUrls = this.state.selectedUrls;
          let $this = this;
          let rowSelection = {
            selectedUrls,
            onChange: this.onSelectUrlChange.bind($this),
            onSelectAll:this.onSelectUrlAll.bind($this)
          }
          let pagination={ //分页
            total: this.state.urlData.length, //数据总数量
            pageSize: 5,  //显示几条一页
            showSizeChanger: true,  //是否显示可以设置几条一页的选项
            showQuickJumper:true,
            showTotal:()=> {  //设置显示一共几条数据
                return '共 ' + this.state.urlData.length + ' 条数据'; 
            }
        }
        return (
            <Table rowSelection={rowSelection}columns={columns} dataSource={data} pagination={pagination}/>
        )
    }
    onSelectUrlChange(keys,rows){
        console.log(keys,rows)
    }
    onSelectUrlAll(selected,rows){
        console.log(selected,rows);
    }
    configureDomain(){
        let domainIds = this.state.selectedDomains;
        let domainId;
        if (domainIds.length >1) {
            message.warn('只能选择一行数据。');
            return;
        }else if(domainIds.length == 1) {
            domainId = domainIds[0];
        }else {
            message.error('您还没有选择域名。');
            return;
        }
        this.props['history'].push({
            pathname:'/cdn/adddomain',
            state:{
                domainId
            }
        });
    }
    addDomain(){
        this.props.history.push('/cdn/adddomain')
    }
    deleteDomain(){

    }
    render () {
        return (
            <div className="business-management">
                <Title text="业务管理" />
                <div style={{paddingTop:38}}>
                    <ul className="clearfix business-header">
                        <li><i className="icon-protect"></i>受保护域名：<span>3</span></li>
                        <li>累计保护次数：<span>3</span></li>
                        <li><i className="icon-protect"></i>受保护URL：<span>3</span></li>
                        <li>累计保护次数：<span>3</span></li>
                    </ul>
                </div>
                {/* 域名用户管理 */}
                <div className="domain-management">
                    <button className="business-btn active" onClick={this.addDomain.bind(this)}>添加域名</button>
                    <button className="business-btn" onClick={this.showDeleteDomain.bind(this)}>删除域名</button>
                    <button className="business-btn" onClick={this.configureDomain.bind(this)}>配置域名解析</button>
                </div>
                <div>
                    {this.getDomainData()}
                </div>
                <div className="url-managemenrt">
                    <button className="business-btn active" onClick={this.addUrl.bind(this)}>添加URL</button>
                    <button className="business-btn">删除URL</button>
                    <button className="business-btn">导入</button>
                </div>
                <div>
                    {this.getUrlData()}
                </div>
                <Modal title="添加URL" visible={this.state.addUrlVisible} maskClosable={true} onOk={this.onAddConfirm.bind(this)} onCancel={this.onAddCancel.bind(this)}>
                    <input className="ant-input ant-input-large" value={this.state.url} onChange={this.inputUrl.bind(this)} />
                </Modal>
            </div>
        )
    }
}