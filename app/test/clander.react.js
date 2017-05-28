import React, {Component} from 'react'
import {render} from 'react-dom'
import style from './clander.less'
import Scroll from './scroll.react';

var getDays = (year,month)=>{
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
    }
    return daysInMonth[month];
};

class Clander extends Component{
    constructor(){
        super();
        this.state={month:new Date().getMonth()+1,day:new Date().getDate(),hour:new Date().getHours(),minutes:new Date().getMinutes(),allTime:1}
    }
    changeMonth(month){
        this.setState({month:month});
    }
    changeDay(day){
        this.setState({day:day});
    }
    changeHour(hour){
        this.setState({hour:hour});
    }
    changeMinutes(minutes){
        this.setState({minutes:minutes});
    }
    changeAlltime(allTime){
        this.setState({day:allTime});
    }
    render(){
        console.log(this.state.month);
        var months = [1,2,3,4,5,6,7,8,9,10,11,12];
        var l =getDays(new Date().getFullYear(),this.state.month-1);
        var days = [];
        var hours = [];
        var minutes = [];
        for(let i =1 ;i<=l;i++){
            days.push(i);
        }
        for(let i = 0; i<24;i++){
            hours.push(i);
        }
        for(let i = 0;i<60;i++){
            minutes.push(i);
        }
        var allTime = [15,30,45,60,90,120,180];
        var all = [months,days,hours,minutes,allTime];
        return(
            <div className = {style.clander}>
                {
                    all.map((e,i) =>{
                        var head ='';
                        var index;
                        var callB;
                        switch (i) {
                            case 0:
                                head = "月"
                                index = this.state.month-1;
                                callB = this.changeMonth
                                break;
                            case 1:
                                head="日"
                                index = this.state.day-1;
                                callB = this.changeDay
                                break;
                            case 2:
                                head = "时"
                                index = this.state.hour-1;
                                callB = this.changeHour
                                break;
                            case 3:
                                head="分"
                                index = this.state.minutes-1;
                                callB = this.changeMinutes
                                break;
                            case 4:
                                head="时长"
                                index = this.state.allTime-1;
                                callB = this.changeAlltime
                                break;
                            default:
                                break;
                        }
                        return(
                                <Scroll head={head} content={e} index ={index} callB = {callB.bind(this)}/>
                        )
                    })
                }
                <div>
                {this.state.month+" "+this.state.day+" "+this.state.hour}
                </div>
            </div>
        )
    }
}

module.exports = Clander;
