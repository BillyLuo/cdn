import * as React from 'react';
import {Menu,Icon} from 'antd';
const SubMenu = Menu.SubMenu;
import './secondmenu.css';

export default class SecondMenu extends React.Component<{prop?:any,onClickSecondMenu?:any,menuData?:any},{}>{
    constructor(props:any){
        super(props)
    }
    state = {
        collapsed:false,
        selectedKey:'',
        defaultOpenKeys:'',
        subMenuTitle:'费用中心'
    }
    collapse(){
        let collapsed = !this.state.collapsed;
        this.setState({
            collapsed
        })
        let secondMenuWidth = collapsed?'16':'170';
        let secondMenuData:any = [];
        if (this.props.onClickSecondMenu && typeof this.props.onClickSecondMenu == 'function'){
            this.props.onClickSecondMenu(collapsed,secondMenuWidth,secondMenuData);
        }
    }
    menuCtrl() {
        this.setState({
            collapsed:false
        })
    }
    componentDidUpdate(){
       
    }
    componentWillUnmount () {
        console.log('unmount ------hellohello');
    }
    //解决强制刷新菜单丢失问题
    setMenuSelected () {
        let $this = this,menuNodes:any;
        let selectedKey = this.props.menuData.pathname;
        if (this.props.menuData && this.props.menuData['nodes']) {
            menuNodes = this.props.menuData.nodes;
        }else {
            menuNodes = [];
        }
        for (var i = 0;i<menuNodes.length;i++) {
            if (menuNodes[i].children && menuNodes[i].children.length) {
                let childrenNodes = menuNodes[i].children;
                var openkey = menuNodes[i].path;
                for(var j = 0;j<childrenNodes.length;j++){
                    if (selectedKey==childrenNodes[j].path){
                        
                    }
                }
            }
        }
    }
    clickMenu(item:any){
        if (this.props.prop && this.props.prop.history){
            if (item && item.key) {
                this.props.prop.history.push(item.key);
            }
        }
    }
    componentWillReceiveProps () {
        
    }
    componentWillMount () {
        console.log('willll----mount');
    }
    renderMenu () {
        return this.props.menuData.nodes.map((value:any,index:any)=>{
            let node:any = value;
            if (node['children']) {
                return (
                    <SubMenu type="mail" key={value.path} title={<span>{value.title}</span>}>
                        {value.children.map((value:any,index:any)=>{
                            return (
                                <Menu.Item key={value.path}>
                                    <span>{value.title}</span>
                                </Menu.Item>
                            )
                        })}
                    </SubMenu>
                )
            }else {
                return (
                    <Menu.Item key={value.path}>
                        <span>{value.title}</span>
                    </Menu.Item>
                )
            }
        })
    }
    getMenu () {
        let $this = this,menuNodes:any;
        let selectedKey;
        let defaultOpenKeys;
        let menuTitle;
        if (this.props.menuData && this.props.menuData.pathname) {
            selectedKey = this.props.menuData.pathname;
        }
        if (this.props.menuData && this.props.menuData.title) {
            menuTitle = this.props.menuData.title;
        }
        if (this.props.menuData && this.props.menuData['nodes'] && this.props.menuData['nodes'].length) {
            menuNodes = this.props.menuData.nodes;
        }else {
            menuNodes = [];
        }
        for (var i = 0;i<menuNodes.length;i++) {
            if (menuNodes[i].children && menuNodes[i].children.length) {
                let childrenNodes = menuNodes[i].children;
                var openkey = menuNodes[i].path;
                for(var j = 0;j<childrenNodes.length;j++){
                    if (selectedKey==childrenNodes[j].path){
                        defaultOpenKeys = menuNodes[i].path;
                    }
                }
            }
        }
        if (this.props.menuData && this.props.menuData.nodes && this.props.menuData.nodes.length){
            return (
                <div id="sub-menu" style={{width:this.state.collapsed?'16px':'170px',transition:'0.1s linear','overflow':'hidden',position:'relative', float:'left',height:'calc(100vh - 50px)',background:'#efeff1' }}>
                    <div className={this.state.collapsed?'second-menu-title-close':'second-menu-title'}>
                        {menuTitle}
                    </div>
                    <Menu className="second-menu"
                    defaultSelectedKeys={[selectedKey]}
                    mode="inline"
                    inlineCollapsed={this.state.collapsed}
                    defaultOpenKeys={[defaultOpenKeys]}
                    onClick={this.clickMenu.bind(this)}
                    style={{background:'#efeff1',display:this.state.collapsed?'none':'block'}}
                    >
                    {this.renderMenu()}
                    </Menu>
                    <div id="menu-ctrl" className={this.state.collapsed?'second-menu-ctrl-close':'second-menu-ctrl'} onClick={this.collapse.bind(this)}>
                        <div className="second-menu-bg"></div>
                        <div className="second-menu-icon">
                            <Icon style={{fontSize:'14px'}} type={this.state.collapsed?'menu-unfold':'menu-fold'} />
                        </div>
                    </div>
                </div>
            )
        }else {
            return (
                ''
            )
        }
    }
    render () {
        return (
            <div>{this.getMenu()}</div>
        )
    }
}