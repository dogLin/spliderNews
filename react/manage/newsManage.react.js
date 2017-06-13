import React,{Component} from 'react';
import $ from 'jquery';
import {Spin,Icon,Table,Input } from 'antd';

import stl from './newsManage.less';
import newAjax from '../ajax/newAjax';
const Search = Input.Search;
function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}
class Content extends Component{
	constructor(p){
		super(p);
		this.state = {
			news:[]
		}
		newAjax.getAllNews().then((result) =>{
			if(result.success){
				this.setState({news:result.data});
			}
		})
	}
	componentWillMount(){
		
	}
	deleteNew(data){
		newAjax.deleteNewById(data._id).then((result) =>{
			if(result.success){
				var news = this.state.news;
				news.splice(news.indexOf(data),1);
				this.setState({news:news});
				DogLin.Notify({message:"删除成功！",des:'删除成功',type:'success'});
			}
		})
	}
	searchNew(value){
		console.log(value);
		newAjax.getNewByName(value).then((result) =>{
			if(result.success){
				if(result.data.length == 0){
					DogLin.Notify({message:"没有相关新闻",des:"您好！没有与您搜索的关键字匹配的结果"});
				}
				this.setState({news:result.data});
				document.removeEventListener('scroll',this.nextPage);
			}
		})
	}
	render(){
		var allNews = [];
		allNews = this.state.news || [];
		const columns = [
		  { title: '标题', dataIndex: 'title', key: 'title' },
		  { title: '日期', dataIndex: 'date', key: 'date',render:(text,data)=><div>{new Date(data.date).toLocaleString()}</div>,sorter: (a, b) =>	new Date(a.date) - new Date(b.date) },
		  { title: '类别', dataIndex: 'variety', key: 'varirty' },
		  { title: '操作', dataIndex: '', key: 'x', render: (text,data) => <a onClick={this.deleteNew.bind(this,data)}><Icon type="delete" />删除</a> },
		  { title: '查看', dataIndex: '', key: 'v', render: (text,data) => <a target="blank" href={"/news/id/"+data._id}><Icon type="eye-o" />查看</a> },
		];
		return(
			<div className={stl.border}>
				<div className={stl.head}>新闻管理 <Search
						    placeholder="输入标题搜索"
						    style={{ width: 200 }}
						    onSearch={this.searchNew.bind(this)}
						  /> </div>
				<Table
				    columns={columns}
				    dataSource={allNews}
				    rowKey= "_id"
				    onChange={onChange}
				/>
			</div>
		)
	}

}

module.exports = Content;
