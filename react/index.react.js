import React from 'react';
import ReactDom from 'react-dom';
import {Router,Route,Link,browserHistory,IndexRoute} from 'react-router';
import Main from './main/main.react';
import Home from './home/content.react';
import News from './new/new.react';
import Personal from './personal/personCenter.react';
import Direct from './personal/direct.react';
import NewMana from './manage/newsManage.react'

import NewAjax from './ajax/newAjax';
import All from './js/all';
NewAjax.ifLogin().then((data)=>{
	All.init(); //初始化全局变量
	if(data.result){
		DogLin.userInfo = data.user;
	}
	ReactDom.render(
		<Router history = {browserHistory}>
			<Route path='/' component = {Main}>
				<IndexRoute component = {Home}/>
				<Route path='/news' component = {Home} />
				<Route path='/news/id/:id' component = {News} />
				<Route path="/user" component = {Personal} />
				<Route path='/user/direct' component={Direct} />
				<Route path='/news/:type' component = {Home} />
				<Route path='/manage/new' component = {NewMana} />
			</Route>
		</Router>,
		document.getElementById('root')
	)
})
