import React ,{Component} from 'react';
import stl from './404.less';

class NotFound extends Component{
	constructor(p){
		super(p);

	}
	render(){
		return(
			<div className = {stl.border}>
				<div className="demo">
				    <p><span>4</span><span>0</span><span>4</span></p>
				  <p>该页面不存在(´･ω･`),点此→<a href="http://localhost:3000/" >回到首页</a></p>
				 </div>
			</div>
		)
	}
}
module.exports = NotFound;