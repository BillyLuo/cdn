import * as React from 'react';
import {Button} from 'antd';
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
            <div>
                这里是home页面
            </div>
        )
    }
}