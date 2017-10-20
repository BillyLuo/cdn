import * as React from 'react';
// import '../menu.less';

import {message,Badge,Menu,Icon,Button } from 'antd';
const SubMenu = Menu.SubMenu;
export default class MainMenu extends React.Component<{prop?:any,onClickMenu?:any}, {collapsed:boolean}>{
    constructor(props:any) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }
    menuNodes:any = [
        {path:'/uc/home',title:'首页',icon:'home'},
        {path:'/uc/user',title:'账户管理',icon:'user'},
        {path:'/uc/cloud',title:'云服务',icon:'cloud-o',children:[
            {path:'/uc/chain',title:'专属链账本',icon:'book'}
        ]},
        {path:'/uc/fee',title:'费用中心',icon:'wallet',children:[
            {path:'/uc/1-1',title:'1-1',icon:'wallet'},
            {path:'/uc/1-2',title:'1-2',icon:'some2'},
            {path:'/uc/1-3',title:'1-3',icon:'some3'},
        ]}
    ];
    
    //菜单的展开与收拢
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
        let collapsed = !this.state.collapsed;
        let mainMenuWidth = collapsed?'64':'160';
        let MainMenuData = {};
        let subMenuData = {};
        this.props.onClickMenu(collapsed,mainMenuWidth,subMenuData,MainMenuData);
    }
    collapse(item?:any,obj?:any){
        let collapsed = !this.state.collapsed;
        let mainMenuWidth;
        if (item && item =='itemclick'){
            collapsed = true;
            this.setState({
                collapsed
            })
            if (this.props.prop['history']) {
                this.props.prop['history'].push(obj.key);
            }
        }else {
            this.setState({
                collapsed:!this.state.collapsed
            },()=>{
                mainMenuWidth = collapsed?'64':'160';
                this.props.onClickMenu(collapsed,mainMenuWidth);
            })
            return;
        }
        //点击主要菜单事件
        mainMenuWidth = collapsed?'64':'160';
        let MainMenuData = {};
        let subMenuData = {};
        console.log('item--------',obj);
        if (obj && obj.key) {
            let key = obj.key;
            if (key == '/uc/user' || key == '/uc/1-2') {
                subMenuData = {
                    nodes:[
                        {path:'/uc/22',title:'111',icon:'home'},
                        {path:'/uc/user',title:'222',icon:'user'},
                        {path:'/uc/cloud',title:'333',icon:'cloud-o',children:[
                            {path:'/uc/chain',title:'444',icon:'book'}
                        ]},
                        {path:'/uc/fee',title:'555',icon:'wallet',children:[
                            {path:'5-1',title:'5-1',icon:'wallet'},
                            {path:'5-2',title:'5-2',icon:'some2'},
                            {path:'5-3',title:'5-3',icon:'some3'},
                        ]}
                    ]
                };
            }
        }
        this.props.onClickMenu(collapsed,mainMenuWidth,subMenuData,MainMenuData);
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
            <div style={{ float:'left',width: this.state.collapsed?64:160,height:'calc(100vh - 50px)',background:'#262930' }}>
                <Button type="primary" onClick={this.collapse.bind(this)} style={{ transition:'0.1s',borderRadius:'0',marginBottom:0,width:this.state.collapsed?64:160,background:'#4a5064',borderWidth:'0px' }}>
                <Icon style={{fontSize:'20px'}} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                </Button>
                <Menu className="menu"
                defaultSelectedKeys={['/about']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
                onClick={this.collapse.bind(this,'itemclick')}
                style={{background:'#262930'}}
                >
                {this.renderMenu()}
                </Menu>
            </div>
        )
    }
}