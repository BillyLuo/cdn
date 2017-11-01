import * as React from 'react';

import {Menu,Icon,Button } from 'antd';
const SubMenu = Menu.SubMenu;
export default class MainMenu extends React.Component<{prop?:any,onClickMenu?:any}, {collapsed:boolean}>{
    constructor(props:any) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }
    menuNodes:any = [
        {path:'/cdn/home',title:'首页',icon:'home'},
        // {path:'/cdn/cdn',title:'CDN',icon:'cloud-o',children:[
        //     {path:'/cdn/aboutcdn',title:'概况',icon:'tags'},
        //     {path:'/cdn/cdndomain',title:'CDN域名',icon:'rocket'},
        //     {path:'/cdn/adddomain',title:'添加域名',icon:'plus-circle'},
        //     {path:'/cdn/downloadlog',title:'日志下载',icon:'copy'}
        // ]},
        {path:'/cdn/hijack',title:'反劫持',icon:'disconnect',children:[
            {path:'/cdn/businessmanagement',title:'业务管理',icon:'appstore-o'},
            {path:'/cdn/operatingdata',title:'运行数据',icon:'database'}
        ]},
        {path:'/cdn/user',title:'用户中心',icon:'user'},        
        // {path:'/cdn/fee',title:'费用中心',icon:'wallet',children:[
        //     {path:'/cdn/chain',title:'费用',icon:''}
        // ]}
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
            if (key == '/cdn/user') {
                subMenuData = {
                    title:'账户管理',
                    nodes:[
                        {path:'/cdn/userbaseinfo',title:'基本资料',icon:''},
                        {path:'/cdn/certification',title:'实名认证',icon:'user'},
                        {path:'/cdn/safesettings',title:'安全设置',icon:'cloud-o'},
                    ]
                };
            }else if(key == '/cdn/1-2'){
                subMenuData = {
                    title:'次级菜单2',
                    nodes:[
                        {path:'/cdn/aa',title:'aaa',icon:'home'},
                        {path:'/cdn/bb',title:'bbb',icon:'user'},
                        {path:'/cdn/cc',title:'ccc',icon:'cloud-o',children:[
                            {path:'/cdn/dd',title:'dd',icon:'book'}
                        ]},
                        {path:'/cdn/aeea',title:'ee',icon:'wallet',children:[
                            {path:'/cdn/fff',title:'ff',icon:'wallet'},
                            {path:'/cdn/xxx',title:'xx',icon:'some2'},
                            {path:'/cdn/yyy',title:'yy',icon:'some3'},
                        ]}
                    ]
                }
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