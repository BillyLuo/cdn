import * as React from 'react';
import {DatePicker,Select,Table} from 'antd';
const Option = Select.Option;
import './operatingdata.css';
// declare var axios;
import Title from '../../components/title/Title'
export default class BusinessManagement extends React.Component<{history?:any},{}>{
    constructor(props:any) {
        super(props)
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
            key: '1',
            hijacktime: '2017-09-09 23:22:22',
            hijacktype: 'type',
            hijackobject: '37',
            customerip:'10.0.1',
            hijackcontent:'some content...',
          }];
        //   let selectedRowKeys = this.state.selectedRowKeys;
          let rowSelection = {
            onChange: this.onSelectChange,
          }
        return (
            <Table rowSelection={rowSelection}columns={columns} dataSource={data} />
        )
    }
    onSelectChange(data){
        console.log(data);
    }
    render () {
        return (
            <div className="business-management">
                <Title text="运行数据" />
                <div style={{paddingTop:38}}>
                    <ul className="clearfix business-header">
                        <li><i className="icon-protect"></i>受保护域名：<span>3</span></li>
                        <li>累计保护次数：<span>3</span></li>
                        <li><i className="icon-protect"></i>受保护URL：<span>3</span></li>
                        <li>累计保护次数：<span>3</span></li>
                    </ul>
                </div>
                <div className="clearfix select-data">
                    <ul>
                        <li>起始日期：<DatePicker /></li>
                        <li>结束日期：<DatePicker /></li>
                        <li>统计单位：
                            <Select style={{width:100}} defaultValue="month">
                                <Option value="day">日</Option>
                                <Option value="month">月</Option>
                            </Select>  
                            <button className="ant-btn" style={{marginLeft:20}}>统计</button>
                        </li>
                    </ul>
                </div>
                <div style={{border:'1px solid #ddd',color:'#2b2b2b',background:'#f7f7f7',height:40,padding:'6px 12px',borderRadius:4}}>
                    <span style={{display:'inline-block',padding:'4px 0'}}>日保护统计</span>
                    <Select style={{float:'right',width:100}} defaultValue="dns">
                        <Option value="dns">DNS域名</Option>
                        <Option value="url">URL</Option>
                    </Select>
                </div>
                <div style={{margin:'24px 0',border:'1px solid #ddd',color:'#2b2b2b',background:'#f7f7f7',height:40,padding:'6px 12px',borderRadius:4}}>
                    <p style={{padding:'6px 0'}}>反劫持日志</p>
                </div>
                {this.getLog()}
            </div>
        )
    }
}