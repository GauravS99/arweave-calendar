import React from 'react';
import styles from '../styles/calendar.css';


let months = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december'
];

let days = [
'sun',
'mon',
'tue',
'wed',
'thu',
'fri',
'sat',
];

function getLastMonthYear(month, year){
	if(month !== 0){
		return {month: month - 1, year: year};
	}	
	else{
		return {month: 11, year: year - 1};
	}
}
function getNextMonthYear(month, year){
	if(month !== 11){
		return {month: month + 1, year: year};
	}	
	else{
		return {month: 0, year: year + 1};
	}
}



export class Calendar extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {month: props.selectedDate.getMonth(), year: props.selectedDate.getFullYear()};
		this.handleNextMonthClick = this.handleNextMonthClick.bind(this);
		this.handleLastMonthClick = this.handleLastMonthClick.bind(this);
	}

	handleNextMonthClick(){
		this.setState(getNextMonthYear(this.state.month, this.state.year));
	}

	handleLastMonthClick(){
		this.setState(getLastMonthYear(this.state.month, this.state.year));
	}

	render(){
		return (
			<div className={styles.fullHeight}>
				<CalendarHeading
				month = {this.state.month}
				year = {this.state.year}
				onNextMonthClick = {this.handleNextMonthClick}
				onLastMonthClick = {this.handleLastMonthClick}

				/>
				<CalendarDaysHeading/>
				<CalendarBody
				selectedDate = {this.props.selectedDate}
				month = {this.state.month}
				year = {this.state.year}
				storageType = {this.props.storageType}
				keyHeader = {this.props.keyHeader}
				items = {this.props.items}
				onDayClick = {this.props.onDayClick}
				onNextMonthClick = {this.handleNextMonthClick}
				onLastMonthClick = {this.handleLastMonthClick}
				/>
			</div>
		);

	}
}


const CalendarDaysHeading  = (props) =>{
	let list = days.map(function(day, i){
		return <div key={i} className= {styles.dayHeading}>{day}</div>
	});


	return (
		<div className={styles.daysHeading}>
			{list}
		</div>
	);
}


const CalendarHeading = (props) => {
	
	let year = (new Date().getFullYear() === props.year)?"":(" " + props.year);

	return (
		<div className = {styles.heading} >
			<button onClick={props.onLastMonthClick}>{"<"}</button>
			<div className={styles.monthHeading}> 
				{months[props.month] + year}
			</div>
			<button onClick={props.onNextMonthClick}>{">"}</button>
		</div>
	);
}

class CalendarBody extends React.Component{

	constructor(props){
		super(props);
		this.onDayClick = this.onDayClick.bind(this);
	}

	onDayClick(e){
		let id = e.currentTarget.id;

		if(id.split("-")[3] === "last"){
			this.props.onLastMonthClick()
		}
		else if(id.split("-")[3] === "next"){
			this.props.onNextMonthClick()
		}

		this.props.onDayClick(id);
	}

	getLastDate(year, month){
		//if the month is not december
		if(month !== 11){
			return new Date(year, month + 1, 0).getDate();
		}
		else{
			return new Date(year + 1, 0, 0).getDate();
		}
	}

	//
	createBoxData(timestamp){
		let count = 0;
		let events;
		let key = this.props.keyHeader + timestamp.join('-');

		if (this.props.storageType === 'local'){
			events = JSON.parse(localStorage.getItem(key));
		}
		else{
			events = this.props.items[key];
		}

		if(events){		//if a list of items exists
			for (let i = 0; i < events.length; i ++){
				if(!events[i].completed){
				count += events[i].priority + 1;
				}
			}
		}

		return count;
	}

	//generates the list for the calendar entries
	createList(){

		let month = this.props.month;
		let year = this.props.year;

		//the numbers represent the index in the entire 5x7 grid, NOT the last date of the month
		let firstDay = new Date(year, month, 1).getDay();
		let lastDay = this.getLastDate(year, month) + firstDay - 1;
		let today = new Date();

		//makes sure the grid has enough rows to have all the dates
		let numBoxes = 28;
		while(numBoxes <= lastDay){
			numBoxes += 7;
		}

		let lastMonth = getLastMonthYear(month, year);
		let nextMonth = getNextMonthYear(month, year);

		let lastMonthKey =  [lastMonth.year, lastMonth.month];
		let nextMonthKey =  [nextMonth.year, nextMonth.month];

		let prevLastDate = new Date(year, month, 0).getDate();

		let items = [];

		//creates 35 boxes
		for(let i = 0; i < numBoxes; i++){
			let timestamp; 
			let type = '';

			if(i < firstDay){
				timestamp = lastMonthKey.concat(prevLastDate - firstDay + i + 1); 
				type = 'last';
			}
			else if(i > lastDay){
				timestamp = nextMonthKey.concat(i - lastDay);
				type = 'next';
			}
			else{
				timestamp = [year, month, (i - firstDay + 1)];
			}

			let style = styles.emptyBox;

			if(timestamp[1] === month){
				style = styles.dayBox;
			}

			//if the current box is the selected day
			if(this.props.selectedDate.getDate() === timestamp[2] &&
				this.props.selectedDate.getMonth() === timestamp[1] &&
				this.props.selectedDate.getFullYear() === timestamp[0]){
					style += " " + styles.selectedBox;
			}

			//if the current box is today
			if(today.getDate() === timestamp[2] &&
				today.getMonth() === timestamp[1] &&
				today.getFullYear() === timestamp[0]){
					style += " " + styles.todayBox;
			}


			items.push(
			<div 
			onClick={this.onDayClick} 
			key = {i}
			id={timestamp.join("-") + "-" + type} 
			className = {style}>
				<div className = {styles.boxHeading}>
					{timestamp[2]}
				</div>
				<CalendarBoxData
					data = {this.createBoxData(timestamp)}
				/>
			</div>
			);
		}

		return items; 
	}

	render(){

		return (
			<div className={styles.gridContainer}>
				<div className={styles.grid}>
					{this.createList()}
				</div>
			</div>
		);
	}
}

//todo reduce this to stateless functional component
class CalendarBoxData extends React.Component {

	// createList(){
	// 	let items = [];	
	// 	let data = this.props.data;
	// 	let style = styles.thumbnail;


	// 	//data is a size 4 array telling how many elements of each priority there are
	// 	for(let i = 0; i < data.length; i++){
			
	// 	}	

	// 	return items;
	// }

	render(){

		let tally = this.props.data;

		//don't show if the tally is 0
		if(tally === 0){
			tally = null;
		}

		return (
			<div className={styles.tally}>
				{tally}
			</div>
		);
	}
}