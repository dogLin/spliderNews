import React ,{Component} from 'react';
import {Link} from 'react-router';
import stl from './newCard.less';
import {Icon} from 'antd'

class NewCard extends Component{
	constructor(p){
		super(p);

	}
	render(){
		var news = this.props.news;
		var style1 = {background:'url('+news.imgSrc+')'};
		var url = "/news/id/"+news._id;
		var videoTime = '';
		if (news.ifVideo){
			videoTime = (<div className={stl.videoTime}>{news.video.videoTime}</div>)
		}
		var style;
		switch(this.props.sortStyle){
			case "block": style = stl.new;break;
			case "list": style = stl.listNew;break;
			
		}
		return(
			<Link to={url} className={style} target="_blank">
				<div className={stl.img}>
					<img src={news.imgSrc} />
					{videoTime}
				</div>
				<div className={stl.new_op}>
					<h2>{news.title}</h2>
					<span>{news.des}</span>
					<div>
						<div>
							{new Date(news.date).toLocaleString()} 
							<span className = {stl.zan}>
								<Icon type="like-o"/>{news.zan} <Icon type="message" />{news.pinL}
							</span>
						</div>
						<div> <Icon type="tag-o" />{news.variety}</div>
					</div>
				</div>
			</Link>
		)
	}
}
module.exports = NewCard;