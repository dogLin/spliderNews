import React,{Component} from 'react';
import stl from './login.less';
import {Icon} from 'antd';
import LoginForm from './loginForm.react';
import RegForm from './reg.react'



class Login extends Component{
	constructor(p){
		super(p);
		this.state={ifClose:true,content:"login"};
		window.DogLin = window.DogLin || {};
		DogLin.showLogin = this.open.bind(this);
	}
	close(){
		this.setState({ifClose:true});
	}
	open(){
		this.setState({ifClose:false});
	}
	changeToLogin(){
		this.setState({content:'login'});
	}
	changeToReg(){
		this.setState({content:'reg'});
		console.log("xxx");
	}
	render(){
		var content='';
		if(this.state.content == "login"){
			content = (<LoginForm changeToReg = {this.changeToReg.bind(this)} close = {this.close.bind(this)}/>);
		}else{
			content = (<RegForm changeToLogin = {this.changeToLogin.bind(this)}/>);
		}
		return(
			<div className={stl.border} disabled={this.state.ifClose}>
				<div className={stl.loginBox}>
					<Icon type = "close-circle" className={stl.close} onClick={this.close.bind(this)} />
					{content}
				</div>
			</div>
		)
	}
}

module.exports = Login;