import * as React from 'react';
import Cloud from './../cloud/Cloud';
import User from './../user/User';
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
import Chain from './../chain/Chain';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
let router = [
    {path:'/uc',exact:true,component:Home},
    {path:'/uc/home',exact:false,component:Home},
    {path:'/uc/cdn',exact:false,component:Home},
    {path:'/uc/user',exact:false,component:BaseInfo},
    {path:'/uc/fee',exact:false,component:Home},
    {path:'/uc/userbaseinfo',exact:false,component:BaseInfo},
    {path:'/uc/certification',exact:false,component:Certification},
    {path:'/uc/personcertification',exact:false,component:PersonCertification},
    {path:'/uc/safesettings',exact:false,component:SafeSettings},
    {path:'/uc/organizecertification',exact:false,component:OrganizeCertification},
    {path:'/uc/setpassword',exact:false,component:SetPassword},
    {path:'/uc/setphone',exact:false,component:SetPhone},
    {path:'/uc/setmail',exact:false,component:SetMail},
    {path:'/uc/setsecurity',exact:false,component:SecurityQuestion}
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