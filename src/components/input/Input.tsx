import * as React from 'react';
export interface AbstractInputProps {
    className?: string;
    defaultValue?: any;
    value?: any;
    style?: React.CSSProperties;
}
export interface InputProps extends AbstractInputProps {
    placeholder?: string;
    type?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    checked?:boolean;
    readOnly?: boolean;
    onPressEnter?: React.FormEventHandler<any>;
    onKeyDown?: React.FormEventHandler<any>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onClick?: React.FormEventHandler<any>;
    onFocus?: React.FormEventHandler<any>;
    onBlur?: React.FormEventHandler<any>;
    autoComplete?: 'on' | 'off';
    spellCheck?: boolean;
    autoFocus?: boolean;
}
export default class Input1 extends React.Component<InputProps,any>{
    constructor(props:any){
        super(props);
    }
    onKeyDown(e){
        if (e.keyCode == 13 || e.which == 13) {
            if (typeof this.props.onPressEnter == 'function'){
                this.props.onPressEnter(e);
            }
        }else {
            if(typeof this.props.onKeyDown == 'function'){
                this.props.onKeyDown(e);
            }
        }
    }
    render(){
        let inputclass = 'ant-input';
        if (this.props['size']) {
            let size = this.props['size'];
            if(size == 'large') {
                inputclass = 'ant-input ant-input-lg';
            }else if(size=="small"){
                inputclass= 'ant-input ant-input-sm';
            }
        }
        if (this.props.disabled) {
            inputclass += ' ' + 'ant-input-disabled';
        }
        if (this.props.className){
            inputclass += ' ' + this.props.className;
        }
        return (
            <input {...this.props} onKeyDown={this.onKeyDown.bind(this)} className={inputclass} />
        )
    }
}