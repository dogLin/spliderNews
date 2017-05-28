import React,{Component} from 'react';
import { Upload, Icon, message } from 'antd';
import stl  from './avatar.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class Avatar extends React.Component {
  constructor(p){
    super(p);
    this.state=({imageUrl:(DogLin.userInfo && DogLin.userInfo.headPic) ? DogLin.userInfo.headPic : DogLin.defaultHead});
  }
  componentDidMount(){
    var url = (DogLin.userInfo && DogLin.userInfo.headPic) ? DogLin.userInfo.headPic : DogLin.defaultHead;
    this.setState({imageUrl:url});
  }

  handleChange(info){
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>{
         this.setState({ imageUrl });
          DogLin.userInfo.headPic = this.state.imageUrl;
          console.log(DogLin.userInfo.headPic);
          DogLin.Notify({message:"更换成功",type:"success"});
      });
    }
  }

  render() {
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        showUploadList={false}
        action={"/api/postImg/"+DogLin.userInfo._id}
        beforeUpload={beforeUpload}
        onChange={this.handleChange.bind(this)}>
        <div className={stl.border}>
          <img src={imageUrl} alt="" className="avatar" /> 
          <div className = {stl.hover}>更换头像</div>
        </div>
      </Upload>
    );
  }
}

module.exports=Avatar;