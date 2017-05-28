import React,{Component} from 'react';
import style from './Greeter.less'

class Greeter extends Component{
    constructor(){
        super();
        this.state={
            ifSelected : true,
            selectedList : []
        }
    }
    changeContent(){
        this.setState({ifSelected:!this.state.ifSelected});
        console.log(this.state.ifSelected)
    }
    addOption(option){
        var selectedList = this.state.selectedList;
        if(selectedList.indexOf(option) < 0){
            selectedList.push(option);
            console.log(selectedList);
            this.setState({selectedList:selectedList});
        }
    }
    delOption(option){
        var selectedList = this.state.selectedList;
        selectedList.splice(selectedList.indexOf(option),1);
        this.setState({selectedList:selectedList});
    }

    render(){
        //点击其他区域关闭下拉框
        if(!this.state.ifSelected){
            document.onclick = (e) =>{
                if(e.target.id !== 'content' && !document.getElementById('content').contains(e.target)){
                    this.setState({ifSelected:!this.state.ifSelected});
                }
            }
        }else{
            document.onclick = (e) =>{
                return;
            }
        }

        var options = [];
        var content = '';
        options = this.props.options;
        var that = this;
        if(this.state.ifSelected){
            content = (
                <div className = "selectedList">
                    {
                        this.state.selectedList.map((selected,index) =>{
                            return(<span className = 'selected' key = {index}>{selected}<span onClick = {this.delOption.bind(this,selected)}  className="del" >{"  x      "}</span></span>)
                        })
                    }
                </div>
            );
        }else{
            var content = (
                <ul id = "content">
                    {
                        options.map(function(option,index){
                            return (<li key = {index} onClick = {that.addOption.bind(that,option)}><span>{(that.state.selectedList.indexOf(option) >= 0?'√':'   ')}</span>{option}</li>)
                        })
                    }
                </ul>
            )
        }
        var placeholder = "至少选择一个班级";
        if(this.state.selectedList.length >0){
            placeholder = "已选择"+this.state.selectedList.length+"个选项";
        }
        return(
            <div className='border'>
                  <input type="text" id='title' placeholder={placeholder} onClick = {this.changeContent.bind(this)} readOnly/>
                  {content}
            </div>
        );
    }
}
export default Greeter
