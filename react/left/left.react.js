import React,{Component} from 'react';
import style from './left.less';
// import $ from 'jquery';
import NewAjax from '../ajax/newAjax';

import {Menu,Icon} from 'antd';
import event from '../js/event';
import {Link} from 'react-router';
const SubMenu = Menu.SubMenu;

class Left extends Component{
	constructor(p){
		super(p);
		this.state = {
			ifNavOpen:false,
			current: '1',
		    openKeys: [],
		    user:undefined
		};
		// NewAjax.ifLogin().then((data)=>{
		// 	if(data.result){
		// 		this.setState({user:data.user});
		// 		DogLin.userInfo = data.user;
		// 	}
		// })
	}
	componentDidMount(){
		
		if(DogLin.userInfo){
			console.log(DogLin.userInfo);
			this.setState({user:DogLin.userInfo});
			console.log(this.state.user);
		}

		this.unsub = event.sub('login',this.changeUser.bind(this));
	}
	componentWillUnMount(){
		this.unsub();
	}
	changeUser(user){
		this.setState({user:user});
		console.log(this.state.user);
	}
	handleClick(e) {
	   console.log('Clicked: ', e);
	   this.setState({ current: e.key });
	 }
	 onOpenChange(openKeys){
	  const state = this.state;
	  const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
	  const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

	  let nextOpenKeys = [];
	  if (latestOpenKey) {
		nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
	  }
	  if (latestCloseKey) {
		nextOpenKeys = this.getAncestorKeys(latestCloseKey);
	  }
	  this.setState({ openKeys: nextOpenKeys });
	}
	getAncestorKeys(key){
	  const map = {
		sub3: ['sub2'],
	  };
	  return map[key] || [];
	}
	changeNav(){
		var input = this.refs.a;
		input.checked = !input.checked;
		this.setState({
			ifNavOpen:!this.state.ifNavOpen
		});
	}
	logOff(){
		NewAjax.logOff().then(()=>{
			this.setState({user:undefined});
			DogLin.Notify({message:"注销成功",des:"您已注销成功！",type:"success"});
			DogLin.userInfo = undefined;
			window.location.href = "http://localhost:3000/";
		})
	}
	render(){
		var person = (
			<div className={style.login} onClick = {window.DogLin?DogLin.showLogin:function(){}}>
						登录
			</div>
		);
		if(this.state.user){
			var user = this.state.user;
			person = (
			<div>
				<Link to = "/user"><img className={style.person} src={user.headPic?user.headPic:DogLin.defaultHead} >
				</img></Link>
				<div className={style.name}>
					<div>{user.userName}</div>
					<div className={style.out} onClick={this.logOff.bind(this)}>注销</div>
				</div>
				<div className={style.des}>{user.des? user.des : "没有介绍"  }</div>
			</div>
			)
		}
		var backStyle = {background:"url("+DogLin.leftBackImg+")"};
		var followTag = DogLin.userInfo?DogLin.userInfo.followTag:[];
		var manage = '';
		var personLike = null;
		 if(DogLin.userInfo&&DogLin.userInfo.type == "mana"){
		 	manage = (
				<SubMenu key="sub4" title={<span><Icon type="setting" /><span>后台管理</span></span>}>
							<Menu.Item key="11"><Link to = "/manage/new">管理新闻</Link></Menu.Item>
				 </SubMenu>
		 	)
		 }
		 if(DogLin.userInfo){
		 	personLike = (
				<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>订&nbsp;&nbsp;&nbsp;阅</span></span>}>
							<Menu.Item key="5"><Link to = "/news/PersonLike">全部</Link></Menu.Item>
							{
								followTag.map(function(data,index){
									var url = '';
									switch(data){
										case "时事": url = "/news/Politic";break;
										case "财经" :  url = "/news/Fiance";break;
										case "思想":  url = "/news/Thought";break;
										case "生活" :  url = "/news/Life";break;
										case "极客" :  url = "/news/Jike";break;
										default:url = '';break;
									}
									return (<Menu.Item key={index+6}><Link to = {url}>{data}</Link></Menu.Item>)
								})
							}
				        </SubMenu>
		 	)
		 }
		var nav = (
			<div className = {style.border} >
				<div className={style.nav} disabled = {!this.state.ifNavOpen} style={backStyle}>
					<div className = {style.loginOut} >
						{person}
					</div>
					<Menu  mode="inline" theme="dark" openKeys = {this.state.openKeys} onClick = {this.handleClick.bind(this)} onOpenChange={this.onOpenChange.bind(this)}
						defaultOpenKeys = {['sub1']} selectedKeys={[this.state.current]} style={{ width: "100%" ,background:'rgba(0,0,0,0)'}}>
						<SubMenu key = 'sub1' title={<span><Icon type="home" /><span>分&nbsp;&nbsp;&nbsp;类</span></span> }>
							<Menu.Item key="1"><Link to = "/news">全部</Link></Menu.Item>
							<Menu.Item key="0"><Link to = "/news/Politic">时事</Link></Menu.Item>
							<Menu.Item key="2"><Link to = "/news/Fiance">财经</Link></Menu.Item>
							<Menu.Item key="3"><Link to = "/news/Thought">思想</Link></Menu.Item>
							<Menu.Item key="4"><Link to = "/news/Life">生活</Link></Menu.Item>
							<Menu.Item key="41"><Link to = "/news/Jike">极客</Link></Menu.Item>
							<Menu.Item key="v"><Link to = "/news/Video">视频</Link></Menu.Item>
						</SubMenu>
						{personLike}
				        {manage}
				        
					</Menu>
				</div>
				<div className ={style.burger_nav} onClick = {this.changeNav.bind(this)}>
					<input ref = "a" type = 'checkbox' className={style.burger_check} />
					<label htmlFor="a" className={style.burger} ></label>
				</div>
			</div>
		);

		return(
				<div>
					{nav}
					<div className={style.palceHolder} disabled = {!this.state.ifNavOpen}></div>
				</div>

		);
	}
}

module.exports = Left;
