import React from 'react';
import {TodoDateHeading, TodoList} from './TodoListPresentation';
import {TodoListContainer, TodoOptionsHeadingContainer, TodoInputContainer,ExtraSettingContainer} from './TodoListLogic';
import styles from '../styles/todo.css';

export class Todo extends React.Component{
	
	constructor(props){
		super(props);

		this.state = {order: "entry time", openExtraSettings: false}
		this.handleSortSelection = this.handleSortSelection.bind(this);
		this.handleRepeatClick =  this.handleRepeatClick.bind(this);
	}

	handleSortSelection(text){
		this.setState({order: text});
	}

	generateList(){
		
		let list = this.props.items.slice();

		if(!this.props.settings.showCompleted){
			let updated = [];
			for(let i = 0; i < list.length; i++){ 
				if (!list[i].completed){
					updated.push(list[i]);
				}
			}	
			//removes any completed items from the total items
			list = updated;
		}

		this.sortList(list);
		return list;
	}

	componentDidUpdate(prevProps, prevState){
		if(prevState.openExtraSettings){
			this.setState({openExtraSettings: false});
		}
	}

	sortList(unsorted){

		if (this.state.order === "entry time"){
			unsorted.sort(function(a, b){
				return a.addTime - b.addTime;
			})
		}
		else if (this.state.order === "priority"){
			unsorted.sort(function(a, b){
				return b.priority - a.priority;
			})
		}
		else if (this.state.order === "soonest"){
			unsorted.sort(function(a, b){
				
				if(a.time === null && b.time === null){
					return 0;
				}
				else if(a.time === null) {
					return 1;
				}
				else if(b.time === null) {
					return -1;
				}

				return a.time - b.time;
			})
		}
	}

	handleRepeatClick(){
		this.setState({openExtraSettings: !this.state.openExtraSettings});
	}

	render(){
		return (
			<div className={styles.todo} >
				<TodoDateHeading date={this.props.date}/>
				<TodoOptionsHeadingContainer
				order={this.state.order}
				handleItemClick = {this.handleSortSelection}
				/>				
				<TodoList 
				items={this.generateList()}
				settings={this.props.settings}
				storageType={this.props.storageType}
				editItem = {this.props.editItem}
				order={this.state.order}
				openExtraSettings = {this.state.openExtraSettings}
				>
				{this.state.openExtraSettings && 
				<ExtraSettingContainer
				handleExtraSettingsBackClick = {this.handleRepeatClick}
				/>}
			   	<TodoInputContainer 
			   	onAddItem={this.props.addItem} 
			   	militaryTime={this.props.settings.militaryTime}
			   	onRepeatClick={this.handleRepeatClick}/>
			   	</TodoList>
			</div>
		);
	}
}