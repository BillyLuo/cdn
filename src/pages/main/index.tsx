import { Menu, Icon, Button } from 'antd';
import * as React from 'react';
import Header from './../../components/Header';
import MainMenu from './../../components/menu/MainMenu';
import Cloud from './../cloud/Cloud';
import User from './../user/User';
import Home from './../home/Home';
import Chain from './../chain/Chain';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import SecondMenu from '../../components/secondmenu/SecondMenu';

export default class Body extends React.Component<{},{}>{
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
        console.log('this is body---pathname'+location.pathname,this.props);
        //ciji
        let nodes:any = [
            {path:'/uc/home',title:'首页',icon:''},
            {path:'/uc/user',title:'账户管理',icon:''},
            {path:'/uc/cloud',title:'云服务',icon:'',children:[
                {path:'/uc/chain',title:'专属链账本',icon:''}
            ]},
            {path:'/uc/fee',title:'费用中心',icon:'',children:[
                {path:'/uc/1-1',title:'1-1',icon:''},
                {path:'/uc/1-2',title:'1-2',icon:''},
                {path:'/uc/1-3',title:'1-3',icon:''}
            ]},
            {path:'/uc/jfl',title:'ac',icon:'',children:[
                {path:'/uc/2-1',title:'2-1',icon:''},
                {path:'/uc/2-2',title:'2-2',icon:''},
                {path:'/uc/2-3',title:'3-3',icon:''}
            ]}
        ];
        this.setState({
            pathname:location.pathname,
            secondMenuData:{
                pathname:location.pathname
            },
            contentWidth:'calc(100% - 170px )'
        })
        if (this.state.secondMenuData && this.state.secondMenuData['nodes']){

        }else {
            this.setState({
                contentWidth:'100%'
            })
        }
    }
    componentWillUpdae(){

    }
    //主菜单回调事件
    onClickMenu(expaned:any,mainMenuWidth:any,subMenuData?:any,mainMenuData?:any){
        console.log('onclickMainMenu',expaned,mainMenuWidth,subMenuData);
        console.log('******',this.refs['sub-menu'],this.refs['sub-menu']['menuCtrl']());
        let nodes = [];
        if (subMenuData && subMenuData.nodes) {
            nodes = subMenuData.nodes;
        }
        //如果没有第二栏菜单的话
        if (!subMenuData) {
            this.setState({
                mainMenuWidth,
                mainWidth:'calc(100% - ' + mainMenuWidth + 'px )',
            })  
            return;  
        }
        if (!(subMenuData && subMenuData.nodes && subMenuData.nodes.length)) {
            this.setState({
                mainMenuWidth,
                mainWidth:'calc(100% - ' + mainMenuWidth + 'px )',
                contentWidth:'100%',
                secondMenuData:{
                    pathname:location.pathname,
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
    render () {
        return (
            <div>
                <Header prop={this.props} />
                <div className="main clearfix">
                    <MainMenu prop={this.props} onClickMenu={this.onClickMenu.bind(this)}/>
                    <div style={{float:'left',width:this.state.mainWidth}}>
                        <SecondMenu ref="sub-menu" prop={this.props} menuData={this.state.secondMenuData} onClickSecondMenu={this.onClickSecondMenu.bind(this)}/>
                        <div className="main-content" style={{float:'left',width:this.state.contentWidth,background:'#f7f7f7',padding:'10px'}}>
                             <Switch>
                                <Route path="/uc" exact component={Home}></Route>
                                <Route path="/uc/home" component={Home}></Route>
                                <Route path="/uc/user" exact component={User}></Route>
                                <Route path="/uc/cloud" component={Cloud}></Route>
                                <Route path="/uc/chain" component={Chain}></Route>
                                <Route path="/uc/user/basicinfo" component={Home}></Route>
                            </Switch>
                            <div style={{width:'100%',background:'#fff'}}>go
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}