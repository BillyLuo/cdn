import * as React from 'react';
import {Upload,Icon,message} from 'antd';

export default class UploadImg extends React.Component<{
    getFile:any,instruction:any,btnText?:string,width?:(number|string),height?:(number|string)
},{
    fileList:any[],picCount:number,src:string
}>{
    
    constructor(props:any) {
        super(props);
        this.state = {
            fileList:[],
            picCount:0,
            src:''
        }
    }
    //
    handle () {
        let fileList = this.state.fileList;
        let formData = new FormData();
        fileList.forEach((file) => {
          formData.append('files[]', file);
        });
        return formData;
    }
    render () {
        let userId;
        let user = JSON.parse(sessionStorage.getItem('userinfo'));
        if (user) {
            userId = user.userId;
        }
        let that = this;
        const props = {
            action:'/bizs/biz/upload.do?fileDesc=personal_realauth&createby='+userId,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                return {
                    fileList: newFileList,
                };
                });
            },
            beforeUpload: (file):any => {
                this.setState(({ fileList }) => ({
                fileList: [file],
                }));
                if (!file) {
                    return false;
                }
                if (file && !(file.type.match(/image\/jpg/gi) || file.type.match(/image\/jpeg/gi) || file.type.match(/image\/gif/gi) || file.type.match(/image\/bmp/gi))) {
                    message.warning('文件类型有误，请重新上传');
                    return false;
                }else if (file && file.size > 1024*1024 * 5) {
                    message.warning('文件大小不能超过5M，请重新选择');
                    return false;
                }else {
                    if (typeof FileReader != 'undefined') {
                        var fileReader = new FileReader();
                        var self = this;
                        fileReader.onload = function (e) {
                            var src = this.result;
                            self.setState({
                                src:src
                            });
                            // var data = self.handle();
                        }
                        fileReader.readAsDataURL(file);
                    }else {
                        // that['msg'].MDComponent.show({message:'浏览器暂不支持预览。'});
                        message.warning('浏览器不支持文件预览，建议升级浏览器');
                    }
                    let count = this.state['picCount'];
                    if (count >= 5) {
                        return false;
                    }else {
                        count ++;
                        that.setState({
                            picCount:count
                        })
                    }
                }
                // return false;
            },
            onSuccess: (ret,file) => {
                var that = this;
                if (ret && ret[0]) {
                    var src = ret[0].id;
                    if (!this.state['src']) {
                        setTimeout(function() {
                            that.setState({
                                src:'/bizs/biz/download.do?fileId='+src
                            });
                        }, 1000);
                    }
                }
                if (ret && ret[0]) {
                    message.success('证件上传成功');
                    if (that.props.getFile) {
                        that.props.getFile(ret,file);
                    }else{
                        console.warn('请设置getFile回调函数');
                    }
                }
            },
            onError:() => {
                // that['msg'].MDComponent.show({message:'证件上传失败，请稍后重试'})
                message.error('证件上传错误，请稍后重试');
            },
            fileList: this.state.fileList
        };
        return (
            <div style={{padding:'10px 0',width:this.props.width?this.props.width:450,margin:'0 auto'}}>
                <div className="clearfix" style={{height:140}}>
                    <div style={{width:120,height:120,float:'left',border:'1px solid #f1f1f1'}}>
                        <img style={{width:120,height:120}} src={this.state.src} alt=""/>
                    </div>
                    <div style={{float:'left',width:'330px',paddingLeft:10,color:'rgb(195,195,195)'}}>
                        {this.props.instruction}
                        <div style={{padding:'10px 0 0 30px'}}>
                            <Upload {...props}>
                                <button style={{width:100,height:28,color:'#333',outline:'none',border:'1px solid rgb(46, 146, 252)',borderRadius:'4px'}}>
                                    <Icon type="upload"/>  {this.props.btnText?this.props.btnText:"选择文件"}
                                </button>
                            </Upload>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}