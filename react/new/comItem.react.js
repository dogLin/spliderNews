import React,{Component} from 'react';
import {Input,Button,Icon} from 'antd'
import stl from './comItem.less';
import NewAjax from '../ajax/newAjax';
class ComItem extends Component{
	constructor(p){
		super(p);
	}
	componentWillMount(){
		
	}
	render(){
		var comment = this.props.comment;
		return(
			<div className={stl.com}>
				<div>
					<img className="smHead" src = {comment.headPic||DogLin.defaultHead}/>
					<span>{comment.userName}</span>
				</div>
				<div className={stl.comR}>
					<div>{comment.content}</div>
					<div className={stl.comTime}>{new Date(comment.date).toLocaleString()}</div>
					<div className={stl.pin}><Icon type="message" title="评论"/></div>
					<Input ref = "com" type="textarea" rows={4} size="large" className={stl.input} placeholder="添加评论"/>
					<Button type="primary" ghost className={stl.send} >评论</Button>
					<div className={stl.subcom}>
						<div >
							<img className="smHead" src = {comment.headPic||DogLin.defaultHead}/>
							<span>{comment.userName}</span>
						</div>
						<div className={stl.comR}>
							<div>{comment.content}</div>
							<div className={stl.comTime}>{new Date(comment.date).toLocaleString()}</div>
							<div className={stl.pin}><Icon type="message" title="评论"/></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

}
module.exports = ComItem;