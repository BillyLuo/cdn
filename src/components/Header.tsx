import * as React from 'react';
import './../App.css';
import {Badge,Icon } from 'antd';
export default class Header extends React.Component<{prop:any},{}>{
    constructor(props:any) {
        super(props)
    }
    state = {
        logout:false,
        username:''
    }
    componentDidMount() {
        let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
        if (userinfo && userinfo.userName) {
            this.setState({
                username:userinfo.userName
            })
        }
    }
    logout () {
        this.setState({
            logout:!this.state.logout
        })
        if (this.props.prop['history']) {
            this.props.prop['history'].push('/login');
        }
    }
    render () {
        return (
            <div className="App-header">
                <div style={{float:'left',height:50,overflow:'hidden'}}>
                    <img src="/img/logo.png" alt=""/>
                </div>
                <div style={{float:'right',padding:'3px 0'}}>
                    <div style={{float:'left',padding:'10px 24px',borderLeft:'1px solid #000',borderRight:'1px solid #000'}}>
                        <Badge style={{marginTop:'6px'}} count={5}>
                            <Icon style={{fontSize:'24px'}} type="mail"/>
                        </Badge>
                    </div>
                    <div className="logout-wrapper" style={{cursor:'default',color:'#fff',position:'relative',fontSize:'16px',float:'left',padding:'10px 24px'}}>
                        <div style={{maxWidth:150,overflow:'hidden',whiteSpace:'no-wrap',textOverflow:'ellipsis'}}>
                            {this.state.username}
                        </div>
                        <div style={{position:'absolute',zIndex:10,top:'42px',left:'0px',width:'100%',height:50,transition:'all 0.3s'}}>
                            <div style={{paddingTop:'6px'}}>
                                <div onClick={this.logout.bind(this)} style={{border:'1px solid #eee',fontSize:'14px',background:'#fff',width:'100%',textAlign:'center'}}>
                                    <div className="logout">登出</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
