var mongoose = require('./db');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	userName:{type:String,index:{unique:true}},
	pass:String,
	salt:String,
	email:String,
	headPic:String,
	creDate:{type:Date,default:Date.now},
	des:String,
	followTag:Array,
	ifFirtLogin:{type:Boolean,default:true},
	sex:{type:Number,default:0},
	news:[],
	type:{type:String,default:'comm'}
});
module.exports = mongoose.model('User',UserSchema);