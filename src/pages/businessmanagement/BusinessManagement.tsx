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
        url:'',
        domainPageNo:1,
        domainPageSize:5,
        domainTotalCount:0,
        urlPageNo:1,
        urlPageSize:5,
        urlTotalCount:0,
        domainLoading:true,//加载表格时的动画
        urlLoading:true
    }
    componentDidMount(){
        console.log(this,this.props);
        this.initDomainData(1,5,);
        this.initUrlData(1,5);
    }
    initDomainData(pageNo?:number,pageSize?:number){
        console.log(pageNo,pageSize);
        let $this = this;
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId;
        if (userinfo && userinfo.userId){
            userId = userinfo.userId;
        }else {
            alert('未找到用户信息，请重新登录。');
            this.props.history.push('/login');
            return;
        }
        let data = {
            userId,
            pageNo,
            pageSize
        }
        axios.post('/bizs/acn/pbqdm.do',data).then((res)=>{
            console.log(res);
            $this.setState({
                domainLoading:false
            })
            if (res.status == 200 ) {
                if (res.data && res.data.errorCode == '000000'){
                    if (res.data.domains && res.data.domains){
                        $this.setState({
                            selectedDomains:[],
                            domainTotalCount:res.data.totalCount
                        })
                        $this.setDomainData(res.data.domains);
                    }else {
                        if ($this.state.domainPageNo >1){
                            $this.initDomainData(1,$this.state.domainPageSize);
                        }else{
                            $this.setDomainData([]);
                        }
                    }
                }else {
                    message.error('网络请求错误，请稍后重试。');   
                }
            }else {
                message.error('网络请求错误，请稍后重试。');
            }
        }).catch((err)=>{
            $this.setState({
                domainLoading:false
            })
            console.log('errrrr',typeof err,err);
            let errMsg = err.toString();
            if(errMsg.match('401') || errMsg.match('406')){
                alert('您的登录信息已超时，请稍后重试。');
                location.href="/login";
                return;
            }
            message.error('网络请求错误，请稍后重试。');
        });
    }
    initUrlData(pageNo?:number,pageSize?:number){
        console.log(pageNo,pageSize);
        let $this = this;
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId;
        if (userinfo && userinfo.userId){
            userId = userinfo.userId;
        }else {
            return;
        }
        axios.post('/bizs/acn/pbqul.do',{
            userId,
            pageNo,
            pageSize
        }).then((res)=>{
            console.log('urls------',res.data);
            $this.setState({
                urlLoading:false
            })
            if (res.data && res.data.errorCode == '000000'){
                if(res.data.urls){
                    let urlData = res.data.urls;
                    $this.setState({
                        urlData,
                        urlTotalCount:res.data.totalCount
                    })
                }else {
                    if ($this.state.urlPageNo>1){
                        $this.initUrlData(1,$this.state.urlPageSize);
                    }else {
                        $this.setState({
                            urlData:[]
                        })
                    }
                }
            }else{
                message.error('获取url错误，请稍后重试');   
            }
        }).catch((err)=>{
            $this.setState({
                urlLoading:false
            })
            console.log(err,'查询失败');
            let errMsg = err.toString();
            if (errMsg.match('401' || errMsg.match('406'))){
                alert('您的登录信息已超时，请重新登录');
                this.props.history.push('/login');
                return;
            }
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
        let urlText = this.state.url.trim();
        let regUrl = /^(https?:\/\/)?\w+(\.\w+)+/g;
        if(!urlText){
            message.error('请输入url');
            return;
        }else if (!regUrl.test(urlText)){
            message.error('请输入合格的url');
            return;
        }
        this.setState({
            url:'',
            addUrlVisible:false
        })
        this.addUrlText();
    }
    onAddUrlPress(e:any){
        if(e.keyCode == 13) {
            this.addUrlText();
        }
    }
    addUrlText(){
        let $this = this;
        let urlText = this.state.url.trim();
        let regUrl = /^(https?:\/\/)?\w+(\.\w+)+/g;
        if(!urlText){
            message.error('请输入url');
            return;
        }else if (!regUrl.test(urlText)){
            message.error('请输入合格的url');
            return;
        }
        this.setState({
            url:'',
            addUrlVisible:false
        })
        axios.post('/bizs/acn/pbnul.do',{urlText}).then((res)=>{
            if (res.data && res.data.errorCode == '000000'){
                message.success('url添加成功');
                let pageNo = $this.state.urlPageNo;
                let pageSize = $this.state.urlPageSize;
                $this.initUrlData(pageNo,pageSize);
            }else if(res.data && res.data.errorDesc){
                message.error(res.daa.errorDesc);
            }else {
                message.error('url添加失败，请稍后重试。');
            }
        }).catch((err)=>{
            console.log(err,'添加url失败');
            message.error('url添加失败，请稍后重试。');
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
    //选择变化的行
    onSelectDomainChange(keys,rows){
        console.log('keys',keys)
        this.setState({
            selectedDomains:keys
        })
    }
    onSelectDomain(item,checked,selected){
        let arr = [];
        if (selected && selected.length){
            for(let i = 0;i<selected.length;i++){
                arr.push(selected[i].key)
            }
        }
        this.setState({
            selectedDomains:arr
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
    //分页
    onDomainPageChange(page:number,pageSize:number){
        this.setState({
            domainPageNo:page?page:1,
            domainPageSize:pageSize?pageSize:5
        })
        this.initDomainData(page,pageSize);
    }
    onUrlPageChange(pageNo?:number,pageSize?:number){
        pageNo = pageNo?pageNo:1;
        pageSize = pageSize?pageSize:5;
        this.setState({
            urlPageNo:pageNo?pageNo:1,
            urlPageSize:pageSize?pageSize:5
        })
        this.initUrlData(pageNo,pageSize);
    }
    onDomainPageSizeChange(pageNo?:number,pageSize?:number){
        this.setState({
            domainPageNo:pageNo?pageNo:1,
            domainPageSize:pageSize?pageSize:5
        })
        this.initDomainData(pageNo,pageSize);
    }
    onUrlPageSizeChange(pageNo?:number,pageSize?:number){
        this.setState({
            urlPageNo:pageNo?pageNo:1,
            urlPageSize:pageSize?pageSize:5
        })
        this.initUrlData(pageNo,pageSize);
    }
    //删除域名
    doDeleteDomain(){
        let $this = this;
        let selectedDomains = this.state.selectedDomains;
        // let domainData = this.state.domainData;
        
        let ids = selectedDomains.join(',');
        axios.post('/bizs/acn/pbddm.do',{domainIds:ids}).then((res)=>{
            console.log(res);
            if(res.data && res.data.errorCode=='000000'){
                let total = this.state.domainTotalCount - selectedDomains.length;
                $this.setState({
                    selectedDomains:[],
                    domainTotalCount:total
                })
                let pageNo = this.state.domainPageNo;
                let pageSize = this.state.domainPageSize;
                $this.initDomainData(pageNo,pageSize);
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
    getDomainData (pageNo?:number,pageSize?:number,TotalCount?:number) {
        let domainPageSize = this.state.domainPageSize;
        let domainTotalCount = this.state.domainTotalCount;
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
            onSelect:this.onSelectDomain.bind($this),
            // onChange: this.onSelectDomainChange.bind($this),
            onSelectAll:this.onSelectDomainAll.bind($this)
          }
          let pagination={ //分页
            // total: this.state.domainData.length,
            total:domainTotalCount,
            pageSizeOptions:['5','10','15','20'],
            onChange:$this.onDomainPageChange.bind(this),
            onShowSizeChange:$this.onDomainPageSizeChange.bind(this),
            pageSize:domainPageSize,  //显示几条一页
            showSizeChanger: true,  //是否显示可以设置几条一页的选项
            showQuickJumper:true,
            showTotal:()=> {  //设置显示一共几条数据
                return '共 ' + domainTotalCount + ' 条数据'; 
            }
        }
        let domainLoading = this.state.domainLoading;
        return (
            <Table rowSelection={rowSelection}columns={columns} loading={domainLoading} dataSource={data} pagination={pagination}/>
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
          let pageSize = this.state.urlPageSize;
          let pagination={ //分页
            total: this.state.urlTotalCount, //数据总数量
            pageSizeOptions:['5','10','15','20'],
            pageSize: pageSize?pageSize:5,  //显示几条一页
            onShowSizeChange:$this.onUrlPageSizeChange.bind(this),
            onChange:$this.onUrlPageChange.bind(this),
            showSizeChanger: true,  //是否显示可以设置几条一页的选项
            showQuickJumper:true,
            showTotal:()=> {  //设置显示一共几条数据
                return '共 ' + this.state.urlTotalCount + ' 条数据'; 
            }
        }
        let urlLoading = this.state.urlLoading;
        return (
            <Table rowSelection={rowSelection} loading={urlLoading} columns={columns} dataSource={data} pagination={pagination}/>
        )
    }
    onSelectUrlChange(keys,rows){
        console.log(keys,rows);
        this.setState({
            selectedUrls:keys
        })
    }
    onSelectUrlAll(selected,rows){
        console.log(selected,rows);
    }
    deleteUrl(){
        let urlIds = this.state.selectedUrls;
        if (!urlIds.length){
            message.warn('请选择要删除的数据行。');
            return;
        }
        let $this = this;
        Modal.confirm({
            title:'删除URL',
            content:'您确定要删除选中的URL么？',
            okText:'确定',
            cancelText:'取消',
            onOk:()=>{
                $this.doDeleteUrl();
            }
        })
    }
    doDeleteUrl(){
        let $this = this;
        let urlIds = this.state.selectedUrls;
        if (urlIds.length==1){
            axios.post('/bizs/acn/pbdul.do',{urlId:urlIds[0]}).then((res)=>{
                if (res.status == 200) {
                    if (res.data && res.data.errorCode == '000000'){
                        message.success('url删除成功。');
                        let pageNo = $this.state.urlPageNo;
                        let pageSize = $this.state.urlPageSize;
                        $this.initUrlData(pageNo,pageSize);
                    }else {
                        message.error('url删除失败。');
                    }
                }
            }).catch((err)=>{
                message.error('url删除失败，请稍后重试。')
            })
        }else if (urlIds.length >1){
            for (let i = 0;i<urlIds.length;i++){
                axios.post('/bizs/acn/pbdul.do',{urlId:urlIds[i]}).then((res)=>{
                    if (res.status == 200) {
                        if (res.data && res.data.errorCode == '000000'){
                            // message.success('url删除成功。');
                            let pageNo = $this.state.urlPageNo;
                            let pageSize = $this.state.urlPageSize;
                            $this.initUrlData(pageNo,pageSize);
                        }else {
                            // message.error('url删除失败。');
                        }
                    }
                }).catch((err)=>{
                    console.log('删除url失败，失败详情',err)
                })
            }
        }
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
            <div className="business-management" style={{paddingBottom:30}}>
                <Title text="业务管理" />
                <div style={{paddingTop:38}}>
                    <ul className="clearfix business-header">
                        <li><i className="icon-protect"></i>受保护域名：<span>{this.state.domainTotalCount}</span></li>
                        <li>累计保护次数：<span>3</span></li>
                        <li><i className="icon-protect"></i>受保护URL：<span>{this.state.urlTotalCount}</span></li>
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
                    <button className="business-btn" onClick={this.deleteUrl.bind(this)}>删除URL</button>
                    <button className="business-btn">导入</button>
                </div>
                <div>
                    {this.getUrlData()}
                </div>
                <Modal title="添加URL" visible={this.state.addUrlVisible} maskClosable={true} onOk={this.onAddConfirm.bind(this)} onCancel={this.onAddCancel.bind(this)}>
                    <input className="ant-input ant-input-large" value={this.state.url} onKeyUp={this.onAddUrlPress.bind(this)} onChange={this.inputUrl.bind(this)} />
                </Modal>
            </div>
        )
    }
}