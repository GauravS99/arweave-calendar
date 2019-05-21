import React from 'react';
import styles from '../styles/heading.css';


export class Heading extends React.Component{
	render(){
		return (
			<div id="Heading" className={styles.heading}>
				<h1 className={styles.title}>product lofi</h1>
				<div className="mainFlex">
				<img onClick= {this.props.handleSettingsClick} className = {styles.settingsIcon} 
				src={require("../../images/settings.svg")} alt="settings icon"/>
				</div>
			</div>
		);
	}
}

export class SettingsContainer extends React.Component{

	constructor(props){
		super(props);
		this.state = {settings: Object.assign({}, this.props.settings)};
		
		this.handleBackClick = this.handleBackClick.bind(this);
		this.changeSetting = this.changeSetting.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleBackClick(){
		this.props.saveSettings(this.state.settings);
	}
	
	handleInputChange(e){
		let setting = e.currentTarget.id;

		let temp = Object.assign({}, this.state.settings)
		temp[setting] = e.target.value;
		this.setState({settings: temp})

	}

	changeSetting(e){
		let setting = e.currentTarget.id;

		//if the setting is a boolean
		if (typeof(this.state.settings[setting]) === typeof(true)){
			let temp = Object.assign({}, this.state.settings)
			temp[setting] = !temp[setting];

			this.setState({settings: temp});
		}
		if (setting === "resetLocal"){
			localStorage.clear();
		}
	}

	render(){


		console.log(this.state.settings)
		return (<Settings
				handleBackClick= {this.handleBackClick}
				settings={this.state.settings}
				changeSetting={this.changeSetting}
				onInputChange={this.handleInputChange}
		/>);
	}
}

export class Settings extends React.Component{

	render(){
		return (
			<div>
				<div onClick={this.props.handleBackClick} className="cover"></div>
				<div className={styles.settingsContainer}>
					<div className="flexBox">
						<h1 className={styles.settingsTitle}>
						Settings	
						</h1>
						<button onClick={this.props.handleBackClick} className={styles.button}>back</button>
					</div>
					<div className={styles.settingsList}>
						<div>
							<h1 className={styles.setting}>
							24 hour time:
							</h1>
							<div id="militaryTime" onClick={this.props.changeSetting} className={styles.settingButton}>
								{this.props.settings.militaryTime?"enabled":"disabled"}
							</div>
						</div>
						<div>
							<h1 className={styles.setting}>
							Show completed items:
							</h1>
							<div id="showCompleted" onClick={this.props.changeSetting} className={styles.settingButton}>
								{this.props.settings.showCompleted?"enabled":"disabled"}
							</div>
						</div>
						<div>
							<h1 className={styles.setting}>
								Background image link:
							</h1>
							<input  placeholder="Enter an image link" 
							id="background"
							value={this.props.settings.background} 
							onChange={this.props.onInputChange}/>
						</div>
						<div>
							<button id="resetLocal" className={styles.button} onClick={this.props.changeSetting}>
								delete local data
							</button>
						</div>
					</div>	
				</div>
			 </div>
		);

	}
}