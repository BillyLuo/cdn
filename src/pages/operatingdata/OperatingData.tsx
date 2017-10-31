import * as React from 'react';
import {DatePicker,Select,Table,Icon,Popover} from 'antd';
const Option = Select.Option;
import './operatingdata.css';
// declare var axios;
import Title from '../../components/title/Title'
declare var echarts;
export default class BusinessManagement extends React.Component<{history?:any},{}>{
    constructor(props:any) {
        super(props);
    }
    componentDidMount(){
        this.initChart();
    }
    state = {
        chartTitle:'日保护统计',
        type:'domain',
        startDate:'',
        endDate:'',
        unit:'day'
    }
    myChart:any;
    initChart(){
        this.myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        let x = (function(){
            let arr = [];
            for(var i = 1900;i<2100;i++){
                arr.push(i+'年')
            }
            return arr;
        })()
        function arr (num:number){
            let arr = [];
            for(let i = 0;i<200;i++){
                let x = Math.random()*num+30;
                arr.push(x);
            }
            return arr;
        }
        let a = arr(10);
        let b = arr(5);
        let c = arr(7);
        let d = arr(9);
        let option = {
            title: {
                text: '日保护统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            grid: {
                left: '3%',
                right: '3%',
                bottom: '5%',
                // containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x
            },
            yAxis: {
                type: 'value',
                min:20,
                max:60
            },
            series: [
                {
                    name:'邮件营销',
                    type:'line',
                    stack: '总量1',
                    data:arr(12)
                },
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量2',
                    data:a
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量3',
                    data:b
                },
                {
                    name:'直接访问',
                    type:'line',
                    stack: '总量4',
                    data:c
                },
                {
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量5',
                    data:d
                }
            ]
        };
        

        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option);
    }
    changeChart(option:any){
        this.myChart.setOption(option);
        
    }
    componentDidUpdate(){
        let x = (function(){
            let arr = [];
            for(var i = 1990;i<2100;i++){
                arr.push(i+'年')
            }
            return arr;
        })()
        function arr (num:number){
            let arr = [];
            for(let i = 0;i<200;i++){
                let x = Math.random()*num+30;
                arr.push(x);
            }
            return arr;
        }
        let a = arr(9);
        let b = arr(7);
        let c = arr(12);
        let d = arr(4);
        let option = {
            title: {
                text: '日保护统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x
            },
            yAxis: {
                type: 'value',
                min:20,
                max:60
            },
            series: [
                {
                    name:'邮件营销',
                    type:'line',
                    stack: '总量1',
                    data:arr(8)
                },
                {
                    name:'联盟广告',
                    type:'line',
                    stack: '总量2',
                    data:a
                },
                {
                    name:'视频广告',
                    type:'line',
                    stack: '总量3',
                    data:b
                },
                {
                    name:'直接访问',
                    type:'line',
                    stack: '总量4',
                    data:c
                },
                {
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量5',
                    data:d
                }
            ]
        };
        console.log(option);
        this.changeChart(option);
        let xx = echarts.getInstanceByDom(document.getElementById('main'));
        console.log(xx);
        xx.resize();
    }
    getLog(){
        const columns = [{
            title: '时间',
            dataIndex: 'hijacktime',
            key: 'hijacktime',
          }, {
            title: '类型',
            dataIndex: 'hijacktype',
            key: 'hijacktype',
          }, {
            title: '对象',
            dataIndex: 'hijackobject',
            key: 'hijackobject',
          }, {
            title: '客户端IP',
            dataIndex: 'customerip',
            key: 'customerip',
          },
          {
            title: '劫持内容',
            dataIndex: 'hijackcontent',
            key: 'hijackcontent',
          }];
          
          const data = [{
            key: '0',
            hijacktime: '2017-09-09 23:22:22',
            hijacktype: 'type',
            hijackobject: '37',
            customerip:'10.0.1',
            hijackcontent:'some content...',
          }];
          for (var i = 1;i<20;i++){
              data.push({
                key: i + '',
                hijacktime: '2017-09-09 23:22:22',
                hijacktype: 'type',
                hijackobject: Math.floor(Math.random()*23+30)+'',
                customerip:'10.0.1',
                hijackcontent:'some content...',
              })
          }
        //   let selectedRowKeys = this.state.selectedRowKeys;
          let rowSelection = {
            onSelect: this.onSelectChange,
          }
        return (
            <Table rowSelection={rowSelection}columns={columns} dataSource={data} />
        )
    }
    //选择行变化时
    onSelectChange(item,selected,selectedArr){
        console.log(selectedArr);
    }
    //设置统计单位日／月
    changeUnit(value){
        console.log(value);
        this.setState({
            unit:value
        })
    }
    //设置dns／url
    changeType(value) {
        console.log(value);
        this.setState({
            type:value
        })
    }
    //设置开始时间
    setStartDate(moment,date){
        console.log(date);
        this.setState({
            startDate:date
        })
    }
    //设置结束时间
    setEndDate(moment,date){
        console.log(date);
        this.setState({
            endDate:date
        })
    }
    render () {
        return (
            <div className="operating-data">
                <Title text="运行数据" />
                <div style={{paddingTop:18}}>
                    <ul className="clearfix business-header">
                        <li><i className="icon-protect"></i>受保护域名：<span>3</span></li>
                        <li>累计保护次数：<span>3</span></li>
                        <li><i className="icon-protect"></i>受保护URL：<span>3</span></li>
                        <li>累计保护次数：<span>3</span></li>
                    </ul>
                </div>
                <div className="clearfix select-data">
                    <ul>
                        <li>起始日期：<DatePicker onChange={this.setStartDate.bind(this)}/></li>
                        <li>结束日期：<DatePicker onChange={this.setEndDate.bind(this)}/></li>
                        <li>统计单位：
                            <Select style={{width:100}} defaultValue="month" onChange={this.changeUnit.bind(this)}>
                                <Option value="day">日</Option>
                                <Option value="month">月</Option>
                            </Select>  
                            <button className="ant-btn" style={{marginLeft:20}}>统计</button>
                        </li>
                    </ul>
                </div>
                <div className="business-header clearfix" style={{padding:'6px 12px',borderRadius:4}}>
                    <span style={{display:'block',lineHeight:'28px',float:'left'}}>日保护统计</span>
                    <Select style={{float:'right',width:100}} defaultValue="domain" onChange={this.changeType.bind(this)}>
                        <Option value="domain">DNS域名</Option>
                        <Option value="url">URL</Option>
                    </Select>
                </div>
                <div style={{height:400}}>
                    <div id="main" style={{width:'100%',height:400}}></div>
                </div>
                <div className="business-header">反劫持日志
                    <Popover content='下载日志'>
                        <Icon style={{fontWeight:600,marginLeft:4}} type="download" />
                    </Popover>
                </div>
                {this.getLog()}
            </div>
        )
    }
}