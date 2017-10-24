import * as React from 'react';
// import Cloud from './../cloud/Cloud';
// import User from './../user/User';
import BaseInfo from '../user/UserBaseInfo';
import Certification from '../certification/Certification';
import PersonCertification from '../certification/PersonCertification';
import OrganizeCertification from '../certification/OrganizeCertification';
import SafeSettings from '../safesettings/safesettings';
import SetPassword from '../safesettings/setpassword';
import SetPhone from '../safesettings/setphone';
import SetMail from '../safesettings/setmail';
import SecurityQuestion from '../safesettings/setsecurity';
import Home from './../home/Home';
// import Chain from './../chain/Chain';
import {Route,Switch} from 'react-router-dom';
let router = [
    {path:'/cdn',exact:true,component:Home},
    {path:'/cdn/home',exact:false,component:Home},
    {path:'/cdn/cdn',exact:false,component:Home},
    {path:'/cdn/user',exact:false,component:BaseInfo},
    {path:'/cdn/fee',exact:false,component:Home},
    {path:'/cdn/userbaseinfo',exact:false,component:BaseInfo},
    {path:'/cdn/certification',exact:false,component:Certification},
    {path:'/cdn/personcertification',exact:false,component:PersonCertification},
    {path:'/cdn/safesettings',exact:false,component:SafeSettings},
    {path:'/cdn/organizecertification',exact:false,component:OrganizeCertification},
    {path:'/cdn/setpassword',exact:false,component:SetPassword},
    {path:'/cdn/setphone',exact:false,component:SetPhone},
    {path:'/cdn/setmail',exact:false,component:SetMail},
    {path:'/cdn/setsecurity',exact:false,component:SecurityQuestion}
]
export default class MainRouter extends React.Component<{},{}>{
    constructor(props:any){
        super(props);
    }
    renderRoute () {
        return router.map((value,index)=>{
            if (value.exact){
                return (
                    <Route key={value.path} path={value.path} exact component={value.component}></Route>
                )
            }else {
                return (
                    <Route key={value.path} path={value.path} component={value.component}></Route>
                )
            }
        })
    }
    render () {
        return(
            <div>
                <Switch>
                    {this.renderRoute()}
                </Switch>
            </div>
        )
    }
} 