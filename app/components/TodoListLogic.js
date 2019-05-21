import React from 'react';
import {TodoList, Input,
 TodoOptionsHeading, DateSelector, 
 TextInput, Dropdown, ExtraSettings} from './TodoListPresentation';

export class TodoInputContainer extends React.Component{

	constructor(props){
		super(props);
		this.state = {priority: 0, text: "", hour: "", minute: "", am: true};
		this.handleCycleButtonClick = this.handleCycleButtonClick.bind(this);
		this.handleStateChange = this.handleStateChange.bind(this);
		this.handleTypeButtonClick = this.handleTypeButtonClick.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.addItem = this.addItem.bind(this);
	}

	componentDidUpdate(prevProps){
		if(this.props.militaryTime !== prevProps.militaryTime ){
			this.setState({hour:"", minute: ""});
		}
	}

	handleCycleButtonClick(event){
		this.setState({priority: (this.state.priority + 1) % 4});
	}

	handleTypeButtonClick(event){
		this.setState({am: !this.state.am});
	}

	handleStateChange(change){
		this.setState(change);
	}

	handleTextChange(event){
		this.setState({text: event.target.value});
	}

	getTextPriority(){
		switch(this.state.priority){
			case 0:
				return "none"
			case 1:
				return "!"
			case 2:
				return "! !"
			case 3:
				return "! ! !"	
		}
	}

	addItem(){
		if(this.state.text.trim() !== ""){
			
			let time = null;
			if(this.state.hour !== ""){
				time = parseInt(this.state.minute);

				let numHours = parseInt(this.state.hour);

				if(!this.props.militaryTime && !this.state.am){
					numHours += 12;
				}

				if(!this.props.militaryTime && this.state.hour === "12"){
					numHours -= 12;
				}

				time += numHours * 60;
			}
			
			this.props.onAddItem({priority: this.state.priority, 
				text: this.state.text, time: time, addTime: (new Date()).getTime(),
				 completed: false});

			this.setState({priority: 0, text: "", hour: "", minute: ""});
		}
	}

	render(){
		return (
			<Input
			onPriorityClick={this.handleCycleButtonClick}
			priority={this.getTextPriority()}
			onAddItemClick={this.addItem}
			onRepeatClick={this.props.onRepeatClick}
			>
			<TextInput
			onChange={this.handleTextChange} 
			value = {this.state.text}
  			/>
			<DateSelectorContainer 
			hour={this.state.hour}
			minute={this.state.minute}
			am={this.state.am}
			onStateChange= {this.handleStateChange} 
			onTypeButtonClick = {this.handleTypeButtonClick}
			militaryTime={this.props.militaryTime}
			/>
		</Input>
		);
	}


}

class DateSelectorContainer extends React.Component{

	constructor(props){
		super(props);
		this.digitCheck = new RegExp('^\\d+$');
		
		this.hourChange = this.hourChange.bind(this);
		this.minuteChange = this.minuteChange.bind(this);
		this.hourBlur = this.hourBlur.bind(this);
		this.minuteBlur = this.minuteBlur.bind(this);
	}

	hourChange(event){
		let current = event.target.value;
		let value = parseInt(current);
		if (!current.match(this.digitCheck)){
			current = current.replace(/\D/g,''); 
		}
		else if (value > 23){
			current = current.substring(0, current.length - 1); //added character is invalid so delete
		}
		else if ((value > 12 || value === 0) && (!this.props.militaryTime)){
			current = current.substring(0, current.length - 1); //added character is invalid so delete
		}

		let toAdd = {hour: current};
		if(current.length === 1 && this.props.minute === ""){ //adds 00 to minute for easy entry
			toAdd.minute = "00";
		}
		else if (current.length === 0){ //if hour is set to nothing, set minute to 0
			toAdd.minute = "";
		}

		this.props.onStateChange(toAdd);
		
	}

	minuteChange(event){
		let current = event.target.value;
		if(!current.match(this.digitCheck)){
			current = current.replace(/\D/g,''); 
		}
		else if (parseInt(current) > 59){
			current = current.substring(0, current.length - 1); //added character is invalid so delete
		}

		this.props.onStateChange({minute: current});
	}

	hourBlur(){
		let current = this.props.hour;
		if(current.length === 2 && current.charAt(0) === "0"){ //deletes leading 0
			this.props.onStateChange({hour: current.charAt(1)});
		}
	}

	minuteBlur(){
		let current = this.props.minute;
		if(current.length === 1){ //adds a 0 at the end for shorthand one digit time 
			current += "0";
		}

		let toAdd = {minute: current};

		if(current.length == 2 && this.props.hour === ""){
			if(this.props.militaryTime)
				toAdd.hour = "0";
			else{
				toAdd.minute = ""
			}
		}
		this.props.onStateChange(toAdd);
	}

	render(){
		return (
			<DateSelector
			onClick={this.props.onTypeButtonClick}
			hour={this.props.hour}
			minute={this.props.minute}
			onChangeHour={this.hourChange}
			onChangeMinute={this.minuteChange}
			onHourBlur={this.hourBlur}
			onMinuteBlur={this.minuteBlur}
			am={this.props.am}
			militaryTime={this.props.militaryTime}
			/>
		);
	}

}

export class TodoOptionsHeadingContainer extends React.Component{
	
	constructor(props){
		super(props);
		this.items = ["entry time", "soonest", "priority"];
		this.state = {dropdown: false};
		
		this.handleItemClick = this.handleItemClick.bind(this);
		this.handleDropdownClick = this.handleDropdownClick.bind(this);
	}

	componentDidUpdate(prevProps){
		if(prevProps.order !== this.props.order){
			this.setState({dropdown: false})
		}
	}

	handleItemClick(text){
		this.props.handleItemClick(text);
	}

	handleDropdownClick(){
		this.setState({dropdown: !this.state.dropdown});
	}

	render(){
		return (<TodoOptionsHeading>
				<Dropdown 
				type={"heading"} 
				dropdown = {this.state.dropdown}
				selection= {this.props.order}
				items={this.items} 
				onItemClick={this.handleItemClick}
				onDropdownClick={this.handleDropdownClick}
				/>
			</TodoOptionsHeading>);
	}
}


export class ExtraSettingContainer extends React.Component{

	render(){
		return (
			<ExtraSettings
				handleExtraSettingsBackClick = {this.props.handleExtraSettingsBackClick}
			/>
		);
	}

}

