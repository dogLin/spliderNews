import React, { Component } from 'react';
import stl from './Editor.less';
// import HommilyEditor from 'HommilyEditor';
class Test extends Component {

    constructor(props, context) {
      super(props, context);
     
    }
    componentDidMount(){
       var editor = new window.wangEditor('editor');
      editor.create();
    }
    render() {
      return (
        <div className = {stl.border} > 
          <div id="editor" className = {stl.editor}>
            <p>请输入内容...</p>
          </div>
        </div>
      )
      
    }
}
export default Test;