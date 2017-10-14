import * as React from 'react';
// import '../menu.less';

import {message,Badge,Menu,Icon,Button } from 'antd';
const SubMenu = Menu.SubMenu;
export default class MainMenu extends React.Component<{prop?:any}, {}>{
    menuNodes:any = [
        {path:'/body/home',title:'首页',icon:'home'},
        {path:'/body/user',title:'账户管理',icon:'user'},
        {path:'/body/cloud',title:'云服务',icon:'cloud-o',children:[
            {path:'/body/chain',title:'专属链账本',icon:'book'}
        ]},
        {path:'/body/fee',title:'费用中心',icon:'wallet',children:[
            {path:'1-1',title:'1-1',icon:'wallet'},
            {path:'1-2',title:'1-2',icon:'some2'},
            {path:'1-3',title:'1-3',icon:'some3'},
        ]}
    ];
    state = {
        collapsed: false,
    }
    //菜单的展开与收拢
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    collapse(obj:any){
        this.setState({
            collapsed:true
        })
        if (this.props.prop['history']) {
            this.props.prop['history'].push(obj.key);
        }
    }
    constructor(props:any) {
        super(props)
    }
    //渲染菜单
    renderMenu () {
        return this.menuNodes.map((value:any,index:any)=>{
            let node:any = value;
            if (node['children']) {
                return (
                    <SubMenu type="mail" key={value.path} title={<span><Icon type={value.icon?value.icon:''}/><span>{value.title}</span></span>}>
                        {value.children.map((value:any,index:any)=>{
                            return (
                                <Menu.Item key={value.path}>
                                    <Icon type={value.icon} />
                                    <span>{value.title}</span>
                                </Menu.Item>
                            )
                        })}
                    </SubMenu>
                )
            }else {
                return (
                    <Menu.Item key={value.path}>
                        <Icon type={value.icon}/>
                        <span>{value.title}</span>
                    </Menu.Item>
                )
            }
        })
    }
    render () {
        return (
            <div style={{ float:'left',width: this.state.collapsed?64:180,height:'calc(100vh - 50px)',background:'#262930' }}>
                <Button type="primary" onClick={this.toggleCollapsed} style={{ transition:'0.1s',borderRadius:'0',marginBottom:0,width:this.state.collapsed?64:180,background:'#4a5064',borderWidth:'0px' }}>
                <Icon style={{fontSize:'20px'}} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <Menu className="menu"
                defaultSelectedKeys={['/about']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
                onClick={this.collapse.bind(this)}
                style={{background:'#262930'}}
                >
                {this.renderMenu()}
                </Menu>
            </div>
        )
    }
}