import React,{Component} from "react";
import {render} from 'react-dom';
import Left from "../left/left.react";
import Login from '../login/Login.react';
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
					<div className = {stl.footer}>底部</div>
				</div>
				<Login/>
				<BackTop />
			</div>
		)
	}
}

module.exports = Main;