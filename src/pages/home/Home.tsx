import * as React from 'react';
import {Button} from 'antd';
import './home.css';
export default class Home extends React.Component<{history?:any},{}>{
    constructor(props:any){
        super(props);
    }
    componentDidMount() {
        console.log(this);
        if (this.props.history) {
            this.props.history.push('/body');
        }
    }
    render () {
        return (
            <div className="home">
                这里是home页面
            </div>
        )
    }
}