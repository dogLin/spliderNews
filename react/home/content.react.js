import React,{Component} from 'react';
import $ from 'jquery';
import {Spin,Icon,Input,Table} from 'antd';
import {Link} from 'react-router';
import stl from './content.less';
import News from './newCard/newCard.react';
import newAjax from '../ajax/newAjax';
import NewMana from '../manage/newsManage.react';
const Search = Input.Search;
class Content extends Component{
	constructor(p){
		super(p);
		this.state = {
			news:[],
			new:null,
			currentPage:1,
			ifLoading:false,
			title:'新闻',
			sortStyle:"block"
		};
		this.nextPage = this.nextPage.bind(this);
	}
	nextPage(){
		var scrollH = document.body.scrollHeight; //滚动条总高度
		var scrollT = document.body.scrollTop; //滚动条距离顶部的高度
		var viewH = document.documentElement.clientHeight; //浏览器窗口的高度
		if ( scrollH-scrollT - viewH == 0 && !this.state.ifLoading){
			setTimeout(()=>{
				this.setState({currentPage:this.state.currentPage+1});
				this.getAllNews.call(this,this.state.currentPage,this.props);
				this.setState({ifLoading:false});
			},100) //100好秒后关闭加载动画并加载下一页
			this.setState({ifLoading:true});
			//将滚动条移动到底部
			document.body.scrollTop = document.body.scrollHeight - document.documentElement.clientHeight;
		};
	}
	componentWillReceiveProps(next){
		document.getElementsByTagName("body")[0].scrollTop = 0;
		document.removeEventListener('scroll',this.nextPage);
		document.addEventListener('scroll',this.nextPage);
		this.getAllNews.call(this,1,next);
	}
	componentWillMount(){
		// document.getElementsByTagName("body")[0].scrollTop = 0;
	}
	componentDidMount(){
		this.getAllNews.call(this,1,this.props);
		document.addEventListener('scroll',this.nextPage);
	}

	componentWillUnmount(){
		document.removeEventListener('scroll',this.nextPage);
	}
	changeStyleToBlock(){
		this.setState({sortStyle:"block"});
	}
	changeStyleToList(){
		this.setState({sortStyle:"list"});
	}
	getAllNews (page,prop){
		document.removeEventListener('scroll',this.nextPage);
		var type = null;
		if(prop.params.type){
			type = prop.params.type;
			switch(type){
				case "Politic": this.setState({title:'时事'});break;
				case "Fiance" : this.setState({title:'财经'});break;
				case "Thought": this.setState({title:'思想'});break;
				case "Life" : this.setState({title:'生活'});break;
				case "Jike" : this.setState({title:'极客'});break;
				case "Video" : this.setState({title:'视频'});break;
				case "PersonLike":this.setState({title:'订阅'});break;
				default:this.setState({title:'新闻'});break;
			}
		}else{
			this.setState({title:'新闻'});
		}
		console.log(this.state.news);
		newAjax.showNewsByPage(page,type,(data)=>{
			if(data.err){
				DogLin.Notify({type:"error",message:"出错了",des:data.err})
			}
			if(data.success){
				if(page == 1){
					this.setState({news:data.data});
				}else{
					this.setState({news:this.state.news.concat(data.data)});
				}
			}
			if(!data.success && data.message=="到达底部!"){
				document.removeEventListener('scroll',this.nextPage);
				DogLin.Notify({type:"info",message:"到达底部",des:"到达底部"});
				this.setState({ifBottom:true});
			}
			document.addEventListener('scroll',this.nextPage);
			
		})
	}
	getNewById(id){

	}
	searchNew(value){
		console.log(value);
		if(value){
			newAjax.getNewByName(value).then((result) =>{
				if(result.success){
					if(result.data.length == 0){
						DogLin.Notify({message:"没有相关新闻",des:"您好！没有与您搜索的关键字匹配的结果"});
					}
					this.setState({news:result.data});
					document.removeEventListener('scroll',this.nextPage);
				}
			})
		}else{
			document.addEventListener('scroll',this.nextPage);
			this.getAllNews.call(this,1,this.props);
		}
		
	}
	render(){
		var allNews = [];
		allNews = this.state.news || [];
		var loading = '';
		var newsList;
		if (this.state.ifLoading && this.state.sortStyle != "mana"){
			loading = <Spin tip="lodgding..."><div style={{height:"100px"}}></div></Spin>
		}
		var bottom = '';
		if(this.state.ifBottom && this.state.sortStyle != "mana"){
			bottom = (<div className={stl.bottom}>到达底部啦!</div>)
		}
		newsList=(
				<div className={stl.news}>
						{
							allNews.map((news,index) =>{
								return(
									<News sortStyle = { this.state.sortStyle} news = {news} key={index} />
								)
	                       })
						}
						
			</div>
		)
		return(
			<div>
				<div className={stl.head}>{this.state.title} <Search
					    placeholder="输入标题搜索"
					    style={{ width: 200 }}
					    onSearch={this.searchNew.bind(this)}
					  /> </div>
				<div className={stl.sortStyle}>
					<Icon className={stl.icon} type="appstore-o" onClick = {this.changeStyleToBlock.bind(this)}/>
					<Icon className={stl.icon} type="bars" onClick = {this.changeStyleToList.bind(this)}/>
				</div>
				{newsList}
				{loading}
				{bottom}
			</div>
		)
	}

}

module.exports = Content;
