import React from 'react';
import styles from '../styles/todo.css';


export class Dropdown extends React.Component{
	
	constructor(props){
		super(props);
		this.handleSelection = this.handleSelection.bind(this);
	}

	handleSelection(e){
		this.props.onItemClick(e.currentTarget.textContent);
	}

	createList(){
		let contentStyle;
		
		if(this.props.type === 'heading'){
			contentStyle = styles.heading;
		}

		let i;
		let items = [];

		for(i = 0; i < this.props.items.length; i++){
			if(this.props.items[i] !== this.props.selection){
				items.push(
					<div key={i} className={contentStyle} onClick={this.handleSelection}>
						{this.props.items[i]}
					</div>
					);
			}
		}
		return items;
	}

	render(){
		let buttonStyle;
		if(this.props.type === 'heading'){
			buttonStyle = styles.dropdownButton;
		}
		 return (
		<div className={styles.dropdown}>
			<div onClick={this.props.onDropdownClick} className={buttonStyle}>
				{this.props.selection}
			</div>
			{this.props.dropdown && 
			<div className={styles.dropdownContent}>
				{this.createList()}
			</div>
			}
		</div>);
	}
}


export class TodoDateHeading extends React.Component{
	
	formatDate(){
		const d = this.props.date;
		const options = {year: 'numeric', month: 'long', day: 'numeric' };
		let dateString = d.toLocaleDateString("en-US", options);
		dateString = dateString.toLowerCase().substring(0,dateString.indexOf(","));
		

		let lastNum = parseInt(dateString.substring(dateString.length - 2, dateString.length).trim()); 
		
		if(lastNum > 10 && lastNum < 20){
			return dateString += "th";
		}
		else{
			switch(lastNum % 10){
				case 1:
					return dateString += "st";
				case 2:
					return dateString += "nd";
				case 3: 
					return dateString += "rd";
				default:
					return dateString += "th";
			}
		}

	}

	render(){


	return (
			<div className={styles.headingContainer}>
				<div className={styles.headingDiv}>
					<p className={styles.heading}>
						 {this.formatDate()}
					</p>
				</div>
			</div>
	)
	}
}

export class TodoOptionsHeading extends React.Component{
	
	render(){
	return (
			<div className={styles.headingContainer}>
				<div className={styles.headingDiv}>
					<h1 className={styles.heading}>
						todo list by
					</h1>
				</div>
				{this.props.children}
			</div>
	)
	}
}

export class TodoList extends React.Component{
	

	constructor(props){
		super(props);
		this.createListItem = this.createListItem.bind(this);
	}


	createListItem(item, i){ 
	 return (
			<li key={"li_" + i}>
				<TodoItem
				item={item}
				militaryTime={this.props.settings.militaryTime}
				editItem = {this.props.editItem}
				/>
			</li>)
	}


	createList(){
		return this.props.items.map(this.createListItem);
	}
	render(){
		return (
			<div className= {styles.listContainer}>
				{this.props.children[0]}
				<ul className= {this.props.openExtraSettings?styles.listBlurred:styles.list}>
					{this.createList()}
				</ul>
				{this.props.children[1]}
			</div>
		);
	}
}

export class Input extends React.Component{
	 
render(){
	return (
		<div className= {styles.inputContainer}>
				{this.props.children[0]}
				<div className={styles.inputSettingsContainer}>
					{this.props.children[1]}
					<div className={styles.prioritySelectorContainer}>
						<span className={styles.mainFont}>Priority:</span>
						<div className={styles.priorityButton} onClick={this.props.onPriorityClick}>
							{this.props.priority}
						</div>
					</div>
				</div>

				<div className={styles.iconDiv} onClick= {this.props.onRepeatClick}>
					<img className = {styles.repeatIcon} 
					src={require("../../images/repeat.svg")} alt="repeat icon"/>
				</div>
				<div>
					<button className={styles.mainFont} onClick={this.props.onAddItemClick}>add</button>
				</div>
		</div>
		);
	}	
}

export const TextInput = (props) => {

	return (
			<div className={styles.textInputItem}>
				<textarea 
				placeholder="What do you want to do?"
				className={styles.textInput}  
				type="text" 
				onChange={props.onChange} 
				value={props.value}
				/>
			</div>
	);

}


export class DateSelector extends React.Component{

	render(){
			return (
			<div className={styles.dateSelectorInputContainer}>
					<input className={styles.dateSelectorInput}
					 onChange={this.props.onChangeHour} 
					 value={this.props.hour}
					 type="text" 
					 maxLength="2"
					 onBlur={this.props.onHourBlur}
					 />
					<span className={styles.mainFont}>:</span>
					<input className={styles.dateSelectorInput}
					 onChange={this.props.onChangeMinute} 
					 value={this.props.minute}
					 type="text" 
					 maxLength="2"
					 onBlur={this.props.onMinuteBlur}
					 />

					{this.props.militaryTime?
					<div className={styles.typeSelector}>24h
					</div>
					:
					<div className={styles.typeSelectorButton} onClick={this.props.onClick}>{this.props.am?"am":"pm"}
					</div>
					}
			</div>
			);
	}
}

export class TodoItem extends React.Component{

	constructor(props){
		super(props);
		this.state = {hovered: false}
		this.toggleHover = this.toggleHover.bind(this);
		this.onInteraction = this.onInteraction.bind(this);
	}
	

	formatTime(){
		if(this.props.item.time != null){
			let minute = this.props.item.time % 60;
			let hour = (this.props.item.time - minute) / 60;
			let am = true;

			if(!this.props.militaryTime && hour > 12){
				hour -= 12;
				am = false;
			}

			if(!this.props.militaryTime && hour === 0){
				hour = 12;
			}

			let hourText= hour + "";
			let minuteText = minute + "";

			if(this.props.militaryTime && hourText.length === 1){
				hourText = "0" + hourText;
			}

			if(minuteText.length === 1){
				minuteText = "0" + minuteText;
			}

			return `${hourText}:${minuteText}${this.props.militaryTime?"":(" " + (am?"am":"pm"))}`;

		}
		else{
			return "";
		}
	}

	toggleHover(){
		this.setState({hover: !this.state.hover});
	}

	onInteraction(e){
		this.props.editItem(e.currentTarget.id, this.props.item.addTime);
	}

	render(){

		let color;

		switch(this.props.item.priority){
			case 0:
				color = "rgb(0,0,0,0)";
				break;
			case 1:
				color = "hsl(172, 0%, 50%)";
				break;
			case 2:
				color = "hsl(172, 50%, 50%)";
				break;
			case 3:
				color = "hsl(172, 100%, 50%)";
				break;
			default:
				color = "rgb(0,0,0,0)"
				break;
		}

		return(
			<div className={styles.listItemContainer}>
				<div className={styles.colorBar} style={{backgroundColor: color}}>
				</div>
				<svg id="checkbox" className={this.props.item.completed?styles.checkBoxCompleted:styles.checkBox} data-icon="check" viewBox="0 0 32 34"
				 onMouseEnter={this.toggleHover}
				 onMouseLeave={this.toggleHover}
				 onClick={this.onInteraction}

				 > 
                 {(this.state.hover || this.props.item.completed) &&
                 <path className={styles.fadeIn} d="M12,25.23,3.23,16.35l3.09-3.09L12,18.89,21.49,7.14l3.62,3.12L12,25.23Z"></path>}
                </svg>
                <div className={this.props.item.completed?styles.itemTextCompleted:styles.itemText}>
                	{this.props.item.text}
                </div>
                <div className={styles.itemTime}>
                	{this.formatTime()}
                </div>

			</div>
		);
	}
}


export const ExtraSettings = (props) =>{

	return (
		<div>
			<div onClick={props.handleExtraSettingsBackClick} className="cover"></div>
			<div className={styles.extraSettingsContainer}>
				<div>
					<div className="inlineBlock">
						Repeat every
					</div>
					<input className={styles.numberSelector} type="number" min="0" max="8"/>
					<div className="inlineBlock">
						weeks
					</div>
				</div>
				<div style={{color: "red"}}>
				unfinished
				</div>
			</div>
		</div>
	);


}


