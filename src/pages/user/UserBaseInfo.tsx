import * as React from 'react';
import Title from '../../components/title/Title';
import {Input,Cascader,Button,message,Spin} from 'antd';
import cityData from '../../data/city';
declare var axios;

export default class BaseInfo extends React.Component<{},{}>{
    state = {
        cityOptionDefault:[],
        cityOption:[],
        btn:'修改',
        province:'',
        city:'',
        street:'',
        tel:'',
        fax:'',
        disabled:true,
        loading:true,
        btnVisible:true
    }
    componentWillMount () {
        let data = [];
        for (let i = 0,len = cityData.length;i<len;i++){
            data.push({value:cityData[i].name,label:cityData[i].name,children:[]})
            if (cityData[i].city) {
                for (let j = 0,len1 = cityData[i].city.length;j<len1;j++) {
                    data[i].children.push({value:cityData[i].city[j].name,label:cityData[i].city[j].name})
                }
            }
        }
        this.setState({
            cityOption:data
        })
    }
    componentDidMount () {
        let $this = this;
        let userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
        if (!userInfo){
            message.error('网络请求错误，请稍后登录重试。');
            this.setState({
                loading:false
            })
            return;
        }
        let userId = userInfo.userId;
        axios.get('/bizrest/bcbizuser/'+userId,{
            
        }).then((res)=>{
            $this.setState({
                loading:false
            })
            if ((res.status == 200 || res.status == 304) && res.data && res.data.userId){
                let userData = res.data;
                if (userData.province && userData.city) {
                    $this.setState({
                        cityOptionDefault:[userData.province,userData.city]
                    })
                }
                if (userData.streets){
                    $this.setState({
                        street:userData.streets
                    })
                }
                if (userData.tel) {
                    $this.setState({
                        tel:userData.tel
                    })
                }
                if (userData.fax) {
                    $this.setState({
                        fax:userData.fax
                    })
                }
            }
        }).catch((err)=>{
            $this.setState({
                loading:false
            })
            message.warning('信息获取出错，请稍后重试');
        })
        
    }
    //选择城市
    chooseCity (data) {
        if (data && data.length) {
            if (data[0]) {
                this.setState({
                    province:data[0]
                })
            }
            if (data[1]) {
                this.setState({
                    city:data[1]
                })
            }
            if (data[0] && data[1]) {
                this.setState({
                    cityOptionDefault:[
                        data[0],data[1]
                    ]
                })
            }
        }else {
            this.setState({
                province:'',
                city:''
            })
        }
    }
    modify(){
        if (this.state.btn == '修改') {
            this.setState({
                disabled:false,
                btn:'提交'
            })
        }else if(this.state.btn == '提交') {
            this.submitData();
        }else {

        }
    }
    submitData () {
        let $this = this;
        let userInfo = JSON.parse(sessionStorage.getItem('userinfo'));
        let userId = userInfo.userId;
        let tel = this.state.tel;
        let fax = this.state.fax;
        let province = this.state.province;
        let city = this.state.city;
        if (!province) {
            province = this.state.cityOptionDefault[0]?this.state.cityOptionDefault[0]:'';
        }
        if (!city) {
            city = this.state.cityOptionDefault[1] ? this.state.cityOptionDefault[1]:'';
        }
        let streets = this.state.street;
        if (tel) {
            if ((!/^1[34578]]\d{9}$/.test(tel) && !/^\d{3,4}-?\d{7,8}$/.test(tel))) {
                message.warning('请输入正确的电话号码');
                return;
            }
        }
        if (fax && !/^\d{3,4}-?\d{7,8}$/.test(fax))  {
            message.warning('请输入正确的传真');
            return;
        }
        if (streets.length > 64) {
            message.error('街道字数过多，不应超过64字');
            return;
        }
        if (!userId) {
            message.warn('找不到您的信息，请重重新登录后重试。');
            return;
        }
        let data = {
            province,
            city,
            streets,
            tel,
            fax
        }
        this.setState({
            loading:true
        })
        axios.put('/bizrest/bcbizuser/'+userId,data).then((res)=>{
            $this.setState({
                loading:false
            })
            if (res.status == 401 || res.status == 406) {
                alert('您的登录信息已超时，请重新登录');
                if (this.props['history']) {
                    this.props['history'].push('/login');
                }
                return;
            }
            if (res.status == 200 && res.data && res.data.retcode == -1) {
                message.success('您的基本信息提交成功');
                $this.setState({
                    btn:'完成'
                })
            }else {
                message.error('信息提交失败，请稍后重试');
            }
        }).catch((err)=>{
            $this.setState({
                loading:false
            })
            message.error('信息提交失败，请稍后重试');
        })
    }
    inputStreet (e:any) {
        this.setState({
            street:e.target.value
        })
    }
    inputTel(e:any){
        this.setState({
            tel:e.target.value
        })
    }
    inputFax (e:any) {
        this.setState({
            fax:e.target.value
        })
    }
    render () {
        return (
            <div>
                <Title text="基本信息"/>
                <div style={{padding:'10px'}}>
                    <div style={{fontSize:12,marginTop:24,padding: '10px 15px',color:'rgb(254, 153, 0)',background:'rgb(255, 240, 217)'}}>
                        请完善以下信息,方便我们更好的为您服务!
                    </div>
                    <div style={{color:'rgb(195,195,195)',lineHeight:'2em',fontSize:14,paddingTop:20}}>
                        联系信息
                    </div>
                    <div>
                        <Spin spinning={this.state.loading} delay={200}>
                            <div style={{width:380,margin:'0 auto'}}>
                                <div style={{margin:'10px 0'}}>
                                    <Input value="中国" disabled size="large"/>
                                </div>
                                <div style={{margin:'15px 0'}}>
                                <Cascader size="large" value={this.state.cityOptionDefault} style={{width:'100%'}} options={this.state.cityOption} disabled={this.state.disabled} onChange={this.chooseCity.bind(this)} placeholder="请选择城市" />
                                </div>
                                <div style={{margin:'15px 0'}}>
                                    <Input onChange={this.inputStreet.bind(this)} disabled={this.state.disabled} value={this.state.street} size="large" placeholder="街道地区"/>
                                </div>
                                <div style={{margin:'15px 0'}}>
                                    <Input onChange={this.inputTel.bind(this)} disabled={this.state.disabled} value={this.state.tel}  size="large" placeholder="联系电话"/>
                                </div>
                                <div style={{margin:'15px 0'}}>
                                    <Input onChange={this.inputFax.bind(this)} disabled={this.state.disabled} value={this.state.fax} size="large" placeholder="传真"/>
                                </div>
                                <div>
                                    <Button onClick={this.modify.bind(this)} style={{width:'100%',marginTop:20,display:this.state.btn=='完成'?'none':'block'}} type="primary" size="large">{this.state.btn}</Button>
                                </div>
                            </div>
                        </Spin>
                    </div>
                </div>
            </div>
        )
    }
}