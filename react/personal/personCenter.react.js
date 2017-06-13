import React,{Component} from 'react';
import stl from './personCenter.less';
import {Link} from 'react-router';
import NewAjax from '../ajax/newAjax';
import NewCard from '../home/newCard/newCard.react';

class personCenter extends Component{
	constructor(p){
		super(p);
		this.state={
			likeList:[],
			commentList:[],
			listType:0
		}
	}
	componentWillMount(){
		if(!DogLin.userInfo){
			window.location.href = "http://localhost:3000/";
		}
		NewAjax.getLikes().then((result)=>{
			if(result.success){
				this.setState({
					likeList:result.data
				})
			}
		});
		NewAjax.getCommentNews().then((result)=>{
			if(result.success){
				this.setState({
					commentList:result.data
				})
			}
		})
	}
	changeToLike(){
		this.setState({
					listType:0
				})
	}
	changeToComment(){
		this.setState({
					listType:1
				})
	}
	render(){
		var user = DogLin.userInfo;
		console.log(user);
		var headPic = (user||user.headPic) ? user.headPic : DogLin.defaultHead;
		var title = "收藏文章列表";
		var list = this.state.likeList;
		if(this.state.listType){
			title = "评论文章列表";
			list = this.state.commentList;
		}
		return(
			<div className = {stl.border}>
				<div className={stl.info}>
					<img className={stl.head} src = {headPic}></img>
					<div className={stl.infoRight}>
						<div className={stl.infoHead}>
							<div>{user.userName}</div>
							<div className={stl.direct}><Link to="/user/direct">编辑信息</Link></div>
						</div>
						<ul >
							<li onClick = {this.changeToLike.bind(this)}><strong>{this.state.likeList.length}</strong><br/><span>收藏</span></li>
							<li onClick = {this.changeToComment.bind(this)}><strong>{this.state.commentList.length}</strong><br/><span>评论</span></li>
						</ul>
						<div>
							个人介绍：{user.des || '没有介绍'}
						</div>
					</div>
					
				</div>
				<div className={stl.newsList}>
					<div className={stl.title}> {title}</div>
							{
								list.map((data,index)=>{
									return(
										<NewCard sortStyle = "list" news = {data} key={index} />
									)
								})
							}
					</div>
				
			</div>
		)
	}
}

module.exports = personCenter;