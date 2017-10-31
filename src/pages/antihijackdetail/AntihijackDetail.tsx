import * as React from 'react';
import Title from '../../components/title/Title';
import {Icon,DatePicker,Select,Popover} from 'antd';
let Option = Select.Option;
declare var echarts;
export default class AntiHijackDetail extends React.Component<{},any>{
    protectChart;
    visitChart;
    constructor(props:any){
        super(props);
        this.state = {
            startDate:'',
            endDate:'',
            unit:'day',
            visits:4,//访问量
            antihijacknum:49//反劫持次数
        }
    }
    componentDidMount(){
        let protects = document.getElementById('protects');
        let visits = document.getElementById('visits');
        this.protectChart = echarts.init(protects);
        this.visitChart = echarts.init(visits);
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
        this.changeProtectChart(option);
        this.changeVisitChart(option);
    }
    changeProtectChart(option){
        this.protectChart.setOption(option);
        let protects = document.getElementById('protects');
        let chartDom = echarts.getInstanceByDom(protects);
        chartDom.resize();
    }
    changeVisitChart(option){
        this.visitChart.setOption(option);
        let visits = document.getElementById('visits');
        let chartDom = echarts.getInstanceByDom(visits);
        chartDom.resize();
    }
    componentDidUpdate(){
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
        this.changeProtectChart(option);
        this.changeVisitChart(option);
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
    render (){
        console.log(arguments);
        return (
            <div className="anti-hajakc-detail">
                <Title text="反劫持详情" />
                <div style={{padding:'18px 10px'}}>
                    <div className="business-header" style={{padding:'10px',lineHeight:'20px'}}>
                        <Icon type="bar-chart" style={{marginRight:10}}/>访问量<span style={{margin:'0 20px 0 10px',color:'#f00'}}>{this.state.visits}</span>  
                        <Icon type="minus-circle-o" style={{marginRight:10}}/>反劫持次数<span style={{marginLeft:10,color:'#f00'}}>{this.state.antihijacknum}</span>
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
                    <div className="business-header">日保护量统计</div>
                    <div id="protects" style={{width:'100%',height:400}}>

                    </div>
                    <div className="business-header">日访问量统计</div>
                    <div id="visits" style={{width:'100%',height:400}}>

                    </div>
                    <div className="business-header">反劫持日志
                        <Popover content="下载日志">
                            <Icon type="download" style={{fontWeight:600,marginLeft:4}}/>
                        </Popover>
                    </div>
                </div>
            </div>
        )
    }
}