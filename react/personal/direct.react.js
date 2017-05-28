import React,{Component} from 'react';
import {Form,Input,Icon,Button,Radio,Checkbox } from 'antd';
import stl from './direct.less';
import newAjax from '../ajax/newAjax';
import Avatar from "./avatar.react";
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;


// class CheckGroup extends Component{
// 	constructor(p){
// 		super(p);
// 		this.state={
// 			checkedList:[],
// 			indeterminate:false,
// 			checkAll:false
// 		};
// 	}
// 	componentDidMount(){
// 		this.props.init || this.props.init();
// 	}
// } 

class Direct extends Component{

	constructor(p){
		super(p);
		this.state={variety:[],myVariety:[]};
	}
	componentDidMount(){
		this.setState({variety:DogLin.Varietys});
		this.setState({myVariety:DogLin.userInfo.followTag});
	}

	checkIfUserNameExist(rule,value,callback){
		if(value != DogLin.userInfo.userName){
			newAjax.ifUserNameExist(value,function(data){
		  		if(!data.error){
		  			if(data.result){
		  				callback();
		  			}else{
		  				callback("用户名已存在！");
		  			}
		  		}
	  		})
		}else{
			callback();
		}
	  	
	}
	handleSubmit(e){
		e.preventDefault();
		var that = this;
	    this.props.form.validateFieldsAndScroll((err, data) => {
	      if (!err) {
	        var salt = DogLin.getSalt();
	        var user = DogLin.userInfo;
	        if(user.userName == data.userName && user.des == data.des && user.sex==data.sex){
	        	DogLin.Notify({message:"保存失败！",des:"未作任何修改，无法保存！",type:"error"});
	        }else{
	        	user.userName = data.userName;
	        	user.des = data.des;
	        	user.sex = data.sex;
	        	console.log(user);
	        	newAjax.updateUser(user).then(function(result){
	        		if(result.success){
	        			DogLin.Notify({message:"修改成功！",des:"修改成功",type:"success"})
	        		}
	        	},function(req){
	        		DogLin.Notify({message:"服务器异常！",des:"服务器异常，请重试或者联系管理员",type:"error"});
	        	});
	        }
	      }
	    });
	}
	changeHand(data){
		if(this.state.myVariety.indexOf(data) >= 0){
			var myVariety = this.state.myVariety;
			myVariety.splice(myVariety.indexOf(data),1);
			DogLin.userInfo.followTag = myVariety;
			this.setState({myVariety:myVariety});
			newAjax.removeTag(DogLin.userInfo._id,data).then(function(data){
				if(data.success){
					DogLin.Notify({message:"取消订阅",des:"您已取消订阅",type:"success"})
				}
			});
		}else{
			var myVariety = this.state.myVariety;
			myVariety.push(data);
			DogLin.userInfo.followTag = myVariety;
			this.setState({myVariety:myVariety});
			newAjax.addFollowTag(DogLin.userInfo._id,data).then(function(data){
				if(data.success){
					DogLin.Notify({message:"添加订阅",des:"您已添加订阅",type:"success"})
				}
			});
		}
	}
	render(){
		const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 6 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 14 },
	      },
	    };
    	const { getFieldDecorator } = this.props.form;
    	var variety = this.state.variety;
		return(
		<div className={stl.out}>
			<div className={stl.border}>
				<div className={stl.form}>
					<Form onSubmit = {this.handleSubmit.bind(this)}>
						<FormItem
				          {...formItemLayout}
				          label="昵称"
				          hasFeedback
				        >
				          {getFieldDecorator('userName', {
				            rules: [{
				         		pattern:/^.{1,9}$/,message: '用户名长度为1-9!'
				         	},{
				         		validator: this.checkIfUserNameExist.bind(this),
				         	}
				         ],initialValue:DogLin.userInfo.userName
				          })(
				            <Input/>
				          )}
					     </FormItem>
						 <FormItem
					          {...formItemLayout}
					          label="介绍"
					        >
					          {getFieldDecorator('des', {
					            rules: [{
					         		pattern:/^.{0,140}$/,message: '介绍不能超过140个文字!'
					         	}
					         ],initialValue:DogLin.userInfo.des
					          })(
					            <Input type="textarea" rows={4}/>
					          )}
					     </FormItem>
						<FormItem
					          {...formItemLayout}
					          label="性别"
					        >
					          {getFieldDecorator('sex',{initialValue:DogLin.userInfo.sex?DogLin.userInfo.sex:0})(
					            <RadioGroup>
							        <Radio value={0}>保密</Radio>
							        <Radio value={1}>男</Radio>
							        <Radio value={2}>女</Radio>
							     </RadioGroup>
					          )}
					     </FormItem>
					     <FormItem>
					     	<Button type = "primary" htmlType="submit" className = {stl.saveBtn} ghost>保存</Button>
					     </FormItem>
					</Form>
				</div>
				<div className={stl.headout}>
					<Avatar />
				</div>
				
			</div>
			<div className={stl.tag}>
				<div className={stl.tab}> 订阅管理 </div>
				<div className={stl.tagList}>
						{
							variety.map((data,index) => {
								var csN = '';
								var type = 'plus'
								if(this.state.myVariety.indexOf(data)>=0){
									csN = stl.haveFollow;
									type = "close";
								}
								return(<span key={index} onClick={this.changeHand.bind(this,data)} className = {csN}>{data}<Icon type={type} /></span>)
							})
						}
				</div>
			</div>
		</div>
		)
	}
}
const DirectForm =Form.create()(Direct);
module.exports = DirectForm;