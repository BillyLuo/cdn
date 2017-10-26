import * as React from 'react';
export default class Title extends React.Component<{text},{}>{
    render(){
        return(
            <div style={{color:'#515151',padding:'14px 0 14px 20px',background:'#f7f7f7'}}>
                <div style={{
                    borderLeft:'2px #2e92fc solid',
                    height:'16px',
                    position:'relative'
                }}>
                    <p style={{fontSize:14,textIndent:'12px',height:'16px',lineHeight:'16px'}}>{this.props.text}</p>
                </div>
            </div>
        )
    }
}