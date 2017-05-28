import React,{Component} from 'react';
import { Form, Input,Icon, Row, Checkbox, Button} from 'antd';
import stl from './login.less';
import newAjax from '../ajax/newAjax';

const FormItem = Form.Item;

class Reg extends Component {
	constructor(p){
		super(p);
		this.state = {
		    confirmDirty: false,
		    autoCompleteResult: [],
		 };
	}
  
  handleSubmit(e){
    e.preventDefault();
	  var that = this;
    this.props.form.validateFieldsAndScroll((err, user) => {
      if (!err) {
        var salt = DogLin.getSalt();
        user.pass = DogLin.getMd5(user.pass,salt);
        user.salt = salt;
        user.confirm = '';
         console.log(user);
        newAjax.reg(user,function(data){
        	DogLin.Notify({message:"注册成功",des:"恭喜您注册成功，请登录！",type:"success"});
        	that.props.changeToLogin();
        });
      }
    });
  }
  handleConfirmBlur(e){
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword(rule, value, callback){
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pass')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  }
  checkConfirm(rule, value, callback){
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  checkIfUserNameExist(rule,value,callback){
  	newAjax.ifUserNameExist(value,function(data){
  		if(!data.error){
  			if(data.result){
  				callback();
  			}else{
  				callback("用户名已存在！");
  			}
  		}
  	})
  }
  checkIfEmailExist(rule,value,callback){
  	newAjax.ifEmailExist(value,function(data){
  		if(!data.error){
  			if(data.result){
  				callback();
  			}else{
  				callback("邮箱已存在！");
  			}
  		}
  	})
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
      <FormItem
          {...formItemLayout}
          label="用户名"
          hasFeedback
        >
          {getFieldDecorator('userName', {
            rules: [{
             required: true, message: '请输入用户名!', whitespace: true 
         	},{
         		pattern:/^.{1,9}$/,message: '用户名长度为1-9!'
         	},{
         		validator: this.checkIfUserNameExist.bind(this),
         	}
         ],
          })(
            <Input />
          )}
        </FormItem>
        
        <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback
        >
          {getFieldDecorator('pass', {
            rules: [{
              required: true, message: '密码不能为空!',
            }, {
              validator: this.checkConfirm.bind(this),
            },{
            	pattern:/^.{6,12}$/,message:"请输入6-12位的密码"
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: '确认密码不能为空!',
            }, {
              validator: this.checkPassword.bind(this),
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="邮箱"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '请输入正确格式的邮箱!',
            }, {
              required: true, message: '邮箱不能为空!',
            },{
         		validator: this.checkIfEmailExist.bind(this),
         	}],
          })(
            <Input />
          )}
        </FormItem>
        <a onClick={this.props.changeToLogin}>已有帐号？直接登录</a>
        <FormItem >
          <Button type="primary" htmlType="submit" size="large" className = {stl.regBtn}>注册</Button>
        </FormItem>
      </Form>
    );
  }
}

const RegForm =Form.create()(Reg);
module.exports = RegForm;