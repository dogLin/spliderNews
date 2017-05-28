import React,{Component} from 'react';
import newAjax from '../ajax/newAjax';
import stl from './new.less';
import {Icon} from 'antd';
import Comment from './comment.react';
class News extends Component {
	constructor(p){
		super(p);
		this.state = {news:'',pre:'',next:'',ifLike:false,ifDisLike:false};
		document.getElementsByTagName("body")[0].scrollTop = 0;
	}
	componentWillMount(){
		newAjax.getNewById(this.props.params.id,(data) =>{
			this.setState({news:data[0]});
		});
		if(DogLin.userInfo){
			newAjax.ifLike(this.props.params.id,DogLin.userInfo._id)
			.then((res)=>{
				if(res.success){
					this.setState({ifLike:true});
				}
			});
			newAjax.ifDisLike(this.props.params.id,DogLin.userInfo._id)
			.then((res)=>{
				if(res.success){
					this.setState({ifDisLike:true});
				}
			});

		}
	}
	likeNew(){
		newAjax.likeNew(this.props.params.id,DogLin.userInfo._id)
			.then((res)=>{
				if(res.success){
					this.setState({ifLike:true});
				}
			});
	}
	removeLikeNew(){
		newAjax.removeLike(this.props.params.id,DogLin.userInfo._id)
				.then((res)=>{
					if(res.success){
						this.setState({ifLike:false});
					}
				})
	}
	changeLike(){
		DogLin.ifLogin(null,()=>{
			if(this.state.ifLike){
				this.removeLikeNew.bind(this)();
			}else{
				this.likeNew.bind(this)();
			}
		});
	}
	disLikeNew(){
		newAjax.disLikeNew(this.props.params.id,DogLin.userInfo._id)
			.then((res)=>{
				if(res.success){
					this.setState({ifDisLike:true});
				}
			});
	}
	removeDisLikeNew(){
		newAjax.removeDisLike(this.props.params.id,DogLin.userInfo._id)
				.then((res)=>{
					if(res.success){
						this.setState({ifDisLike:false});
					}
				})
	}
	changeDisLike(){
		DogLin.ifLogin(null,()=>{
			if(this.state.ifDisLike){
				this.removeDisLikeNew.bind(this)();
			}else{
				this.disLikeNew.bind(this)();
			}
		});
	}
	render(){
		var news = this.state.news || '';
		var next = '';
		var pre = '';
		if(this.state.pre){
			pre = (<Link to = {"/user/:"+this.state.pre}>上一条</Link>);
		}
		if(this.state.next){
			next = (<Link to = {"/user/:"+this.state.next}>下一条</Link>);
		}
		var video = '';
		if(news.ifVideo){
			video = (
				<div>
					<video src = {news.video.videoSrc} poster={news.imgSrc} controls/>
				</div>
			)
		}
		return(
			<div className = {stl.border}>
				{pre} {next}
				<h2>{news.title}</h2>
				<div className={stl.time}>{new Date(news.date).toLocaleString()}</div>
				{video}
				<div  className={stl.content}  dangerouslySetInnerHTML={{__html: news.content}} />
				<div className={stl.likeOrNO}>
					<div className = {this.state.ifDisLike ? stl.select : ''} onClick = {this.changeDisLike.bind(this)}><Icon type={ this.state.ifDisLike?"dislike":"dislike-o"}/>标题党</div> 
					<div className = {this.state.ifLike ? stl.select : ''}onClick = {this.changeLike.bind(this)}><Icon type={this.state.ifLike?"star":"star-o"} />收藏</div> 
				</div> 
				<div className={stl.comment}>
					<Comment newId = {this.props.params.id} commentList={this.state.news.commentList||[]}/>
				</div>         
			</div>
		)

	}
}

module.exports = News;
