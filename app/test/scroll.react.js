import React, {Component} from 'react'
import {render} from 'react-dom'
import style from './scroll.less'

class Scroll extends Component{
    scrollContent(i,e){
        this.refs.sco.scrollTop = i*30;
        this.props.callB(e);
    }
    componentDidMount(){
        this.refs.sco.scrollTop = this.props.index*30;
        console.log(this.refs.sco);
    }
    render(){
        return(
            <div className={style.border}>
                <div className={style.head}>{this.props.head}</div>
                <ul ref="sco">
                    {
                        this.props.content.map((e,i) =>{
                            return (
                                <li onClick = {this.scrollContent.bind(this,i,e)}>{e}</li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

module.exports = Scroll;
