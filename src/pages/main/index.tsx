import * as React from 'react';
import Header from './../../components/Header';
import MainMenu from './../../components/menu/MainMenu';
import SecondMenu from '../../components/secondmenu/SecondMenu';
import MainRouter from '../router/Router';
export default class Body extends React.Component<{history?:any},{}>{
    constructor(props:any){
        super(props);
    }
    state = {
        pathname:'',
        mainMenuWidth:'',//主菜单宽度
        secondMenuWidth:'',//次级菜单宽带
        contentWidth:'calc(100% - 170px)',//不包含二级菜单内容的宽度
        mainWidth:'calc(100% - 160px)',//包括二级菜单的内容宽度
        secondMenuData:{}//二级菜单信息
    }
    componentDidMount() {
        this.listen();
        this.renderSubMenu(location.pathname);
    }
    renderSubMenu(pathname?:any){
        pathname = pathname ? pathname : location.pathname;
        let subMenu;
        if (pathname=="/cdn/userbaseinfo"
        || pathname == '/cdn/user'
        || pathname == "/cdn/certification" 
        || pathname=="/cdn/usersafesettings"
        || pathname=="/cdn/safesettings"
        || pathname=="/cdn/personcertification") {
            subMenu = {
                pathname,
                title:'账户管理',
                nodes:[
                    {path:'/cdn/userbaseinfo',title:'基本资料',icon:''},
                    {path:'/cdn/certification',title:'实名认证',icon:'user'},
                    {path:'/cdn/safesettings',title:'安全设置',icon:'cloud-o'},
                ]
            }
        }
        if (subMenu && subMenu.nodes && subMenu.nodes.length){
            this.setState({
                pathname:location.pathname,
                secondMenuData:subMenu,
                contentWidth:'calc(100% - 170px )'
            })
        }else {
            this.setState({
                secondMenuData:{},
                contentWidth:'100%'
            })
        }
    }
    componentWillUpdae(){

    }
    //主菜单回调事件
    onClickMenu(expaned:any,mainMenuWidth:any,subMenuData?:any,mainMenuData?:any){
        let nodes = [];
        if (subMenuData && subMenuData.nodes && subMenuData.nodes.length) {
            nodes = subMenuData.nodes;
        }
        //如果没有第二栏菜单的话
        if (!subMenuData) {
            this.setState({
                mainMenuWidth,
                mainWidth:'calc(100% - ' + mainMenuWidth + 'px )',
            })  
            return;  
        }else {
            if (this.refs['sub-menu'] && typeof this.refs['sub-menu']['menuCtrl'] == 'function') {
                this.refs['sub-menu']['menuCtrl']()
            }else {
                console.warn('渲染菜单bug');
            }
        }
        if (!(subMenuData && subMenuData.nodes && subMenuData.nodes.length)) {
            this.setState({
                mainMenuWidth,
                mainWidth:'calc(100% - ' + mainMenuWidth + 'px )',
                contentWidth:'100%',
                secondMenuData:{
                    pathname:location.pathname,
                    title:subMenuData.title,
                    nodes
                }
            }) 
            return;
        }
        // 如果有第二栏菜单的话
        this.setState({
            mainMenuWidth,
            mainWidth:'calc(100% - ' + mainMenuWidth + 'px )',
            contentWidth:'calc(100% - '+ 170 + 'px )',
            secondMenuData:{
                pathname:location.pathname,
                title:subMenuData.title,
                nodes
            }
        })
    }
    //第二拦菜单点击回调事件，设置宽度
    onClickSecondMenu(expanded:boolean,secondMenuWidth:string,secondMenuData?:any){
        console.log('secondmenu-----',expanded,secondMenuWidth,secondMenuData);
        this.setState({
            secondMenuWidth,
            contentWidth:'calc(100% - '+secondMenuWidth + 'px )'
        })
    }
    listen(){
        let $this = this;
        this.props.history.listen((location)=>{
            let pathname = location.pathname;
            $this.renderSubMenu(pathname);
        })
    }
    //如果没有二级菜单的话
    noSecondMenu(){
        this.setState({
            secondMenuData:[],
            contentWidth:'100%'
        })
    }
    render () {
        return (
            <div>
                <Header prop={this.props} />
                <div className="main clearfix">
                    <MainMenu prop={this.props} onClickMenu={this.onClickMenu.bind(this)}/>
                    <div style={{float:'left',width:this.state.mainWidth}}>
                        <SecondMenu ref="sub-menu" prop={this.props} menuData={this.state.secondMenuData} onClickSecondMenu={this.onClickSecondMenu.bind(this)}/>
                        <div className="main-content" style={{float:'left',width:this.state.contentWidth,background:'#fff',height:'calc(100vh - 50px)',overflowY:'auto'}}>
                             <MainRouter />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}