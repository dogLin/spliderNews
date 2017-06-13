import React,{Component} from "react";
import {render} from 'react-dom';
import Left from "../left/left.react";
import Login from '../login/login.react';
import stl from './main.less';
import { BackTop } from 'antd';

class Main extends Component{
	constructor(p){
		super(p);
	}
	render(){
		return(
			<div className= {stl.out}>
				<Left/>
				<div className = {stl.main}>
					{this.props.children}
					<div className = {stl.footer}><div>dogLin</div><div>Copyright © 2017- 2017</div></div>
				</div>
				<Login/>
				<BackTop />
			</div>
		)
	}
}

module.exports = Main;