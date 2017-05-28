import React,{Component} from 'react';
import stl from './login.less';
import {Form,Icon,Input,Button,Checkbox} from 'antd';
import NewAjax from '../ajax/newAjax';
import event from '../js/event';
const FormItem = Form.Item;

class LoginForm extends Component{
	handleSubmit(e){
		e.preventDefault();
		var me = this;
		this.props.form.validateFields((err,values) => {
			if(!err){
				values.pass = DogLin.getMd5(values.pass);
				NewAjax.login(values).then(function(data){
					if(data.error){
						DogLin.Notify({type:'error',message:'服务器异常',des:"服务器异常，请重试"});
					}
					if(data.result){
						DogLin.userInfo = data.user;
						if(data.ifFirtLogin){
							DogLin.Notify({type:"success",message:'登录成功',des:"第一次登录"});
						}else{
							DogLin.Notify({type:"success",message:'登录成功',des:"登录成功"});
						}
						event.pub('login',data.user);//发布登录事件
						me.props.close();
					}else{
						DogLin.Notify({type:'error',message:'登录失败',des:"密码错误"});
						console.log("密码错误");
					}
				})
			}
		});
	}
	render(){
		const {getFieldDecorator,getFieldsError,getFieldError,isFieldTouched} = this.props.form;
		const userNameError = isFieldTouched('userName') && getFieldError("userName");
		const passwordError = isFieldTouched('password') && getFieldError("password");
		return(
			<Form onSubmit={this.handleSubmit.bind(this)} className={stl.loginForm}>
				<FormItem>
					{getFieldDecorator('userName',{
							rules:[{required:true,message:'请输入用户名！'}]
						})(
							<Input prefix={<Icon type='user' style={{fontsize:13}} />} 
							placeholder="用户名" />
						)
					}
				</FormItem>
				<FormItem>
					{getFieldDecorator('pass',{
							rules:[{required:true,message:'请输入密码！'}]
						})(
							<Input prefix={<Icon type='lock' style={{fontsize:13}} />} 
							type="password" placeholder="密码" />
						)
					}
				</FormItem>
				<FormItem>
		          {getFieldDecorator('remember', {
		            valuePropName: 'checked',
		            initialValue: true,
		          })(
		            <Checkbox>记住密码</Checkbox>
		          )}
		          <Button type="primary" htmlType="submit" className={stl.loginBtn}>
		            登录
		          </Button>
		          <a onClick={this.props.changeToReg}>注册</a>
		          <a className={stl.findpwd} href="">忘记密码</a>
		        </FormItem>
			</Form>
		)
	}
}

const OutLoginForm = Form.create()(LoginForm);
module.exports = OutLoginForm;