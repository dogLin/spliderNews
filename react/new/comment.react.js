import React,{Component} from 'react';
import {Input,Button} from 'antd'
import stl from './comment.less';
import NewAjax from '../ajax/newAjax';
import ComItem from './comItem.react';
class Comment extends Component{
	constructor(p){
		super(p);
		this.state = {
			comList:[]
		}
	}
	componentWillMount(){
		
	}
	componentWillUnMount(){
		document.getElementsByTagName("body")[0].scrollTop = 0;
	}
	componentWillReceiveProps(next){
		this.setState({comList:next.commentList});
	}
	addComment(){
		var comment =  {};
		var content = this.refs.com.refs.input.value;
		DogLin.ifLogin(null,()=>{
			if(!content){
				DogLin.Notify({message:"评论不能为空",des:"评论不能为空",type:"error"});
			}else{
				comment.newId = this.props.newId;
				comment.userName = DogLin.userInfo.userName;
				comment.headPic = DogLin.userInfo.headPic || DogLin.defaultHead;
				comment.userId = DogLin.userInfo._id;
				comment.date = new Date();
				comment.content = content;
				NewAjax.addComment(comment).then((result)=>{
					if(!result.success){
						DogLin.Notify({message:"系统异常",des:result.message,type:"error"});
					}else{
						 this.refs.com.refs.input.value = '';
						DogLin.Notify({message:"评论成功",des:result.message,type:"success"});
						var list = this.state.comList;
						list.push(comment);
						this.setState({comList:list});
						console.log(this.state);
					}
				})	
			}
		});
		
	}
	render(){
		var user = DogLin.userInfo;
		console.log(this.state);
		var comList = this.state.comList;
		var commentList = [];
		for(let i = comList.length-1;i>=0;i--){
			var comment = comList[i];
			var com = (<div className={stl.com} key = {i}>
									<div>
										<img className="smHead" src = {comment.headPic||DogLin.defaultHead}/>
										<span>{comment.userName}</span>
									</div>
									<div className={stl.comR}>
										<div>{comment.content}</div>
										<div className={stl.comTime}>{new Date(comment.date).toLocaleString()}</div>
									</div>
						</div>);
			commentList.push(com);
		}
		return(
			<div className={stl.border}>
				<div className={stl.add}>
					<img src = {user&&user.headPic||DogLin.defaultHead} className="midHead" />
					<div className={stl.inputR}>
						<Input ref = "com" type="textarea" row={4} size="large" className={stl.input} placeholder="添加评论"/>
						<Button type="primary" ghost className={stl.send} onClick = {this.addComment.bind(this)}>评论</Button>
					</div>
				</div>
				<div className = {stl.comList}>
					<div className = {stl.title}>评论列表</div>
					<div>
						{
							commentList
						}
						{
							this.state.comList.length == 0 ? <div>暂无评论</div>:""
						}
					</div>
				</div>

			</div>
		)
	}
}

module.exports = Comment;
// this.state.comList.map(function(comment,index){
// 								return (<div className={stl.com} key = {index}>
// 									<div>
// 										<img className="smHead" src = {comment.headPic||DogLin.defaultHead}/>
// 										<span>{comment.userName}</span>
// 									</div>
// 									<div className={stl.comR}>
// 										<div>{comment.content}</div>
// 										<div className={stl.comTime}>{new Date(comment.date).toLocaleString()}</div>
// 									</div>
// 								</div>)
// 							})