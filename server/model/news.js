var mongoose = require('./db');
var Schema = mongoose.Schema;
var Comment = new Schema({
	newId:{type:Schema.Types.ObjectId,ref:'News'},
	userName:String,
	headPic:String,
	content:String,
	date:{type:Date,default:Date.now},
	userId:{type:Schema.Types.ObjectId,ref:"User"}

});
var Video = new Schema({
	videoTime:String,
	des:String,
	videoSrc:String
});

var NewsSchema = new Schema({
	title:String,
	des:String,
	imgSrc:String,
	date:{type:Date,default:Date.now},
	content:String,
	commentList:[Comment],
	likes:[{type:Schema.Types.ObjectId,ref:'User'}],
	dislikes:[{type:Schema.Types.ObjectId,ref:'User'}],
	tag:String,
	variety:String,
	url:String,
	ifVideo:{type:Boolean,default:false},
	video:{type:Video},
	zan:{type:Number,default:0},
	pinL:{type:Number,default:0}
});



module.exports = mongoose.model('News',NewsSchema);