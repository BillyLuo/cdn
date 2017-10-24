import * as React from 'react';
import './home.css';
export default class Home extends React.Component<{history?:any},{}>{
    constructor(props:any){
        super(props);
    }
    componentDidMount() {
        // if (this.props.history) {
        //     this.props.history.push('/body');
        // }
    }
    render () {
        return (
            <div className="home">
                这里是home页面
            </div>
        )
    }
}