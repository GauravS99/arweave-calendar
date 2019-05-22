import React from 'react';
import styles from '../styles/heading.css';


export class Heading extends React.Component{
	render(){
		return (
			<div id="Heading" className={styles.heading}>
				<h1 className={styles.title}>Arweave Calendar</h1>
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
		this.state = {settings: Object.assign({}, this.props.settings),
		keyfile: (localStorage.getItem("arweave-calendar-keyfile") || "")};
		this.fileRef = React.createRef();

		this.handleBackClick = this.handleBackClick.bind(this);
		this.changeSetting = this.changeSetting.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleKeyFile = this.handleKeyFile.bind(this);
		this.setKeyFile = this.setKeyFile.bind(this);
		this.handleKeyClear = this.handleKeyClear.bind(this);
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

	setKeyFile(ev){
		localStorage.setItem("arweave-calendar-keyfile", ev.target.result);
		this.setState({keyfile: ev.target.result});
	}

	handleKeyFile(event){
		event.preventDefault();

		let file = this.fileRef.current.files[0];

		var fr = new FileReader()
		fr.onload = this.setKeyFile;

		fr.readAsText(file);
	}

	handleKeyClear(){
		localStorage.setItem("arweave-calendar-keyfile", "");
		this.setState({keyfile: ""});
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

		return (<Settings
				handleBackClick= {this.handleBackClick}
				settings={this.state.settings}
				changeSetting={this.changeSetting}
				onInputChange={this.handleInputChange}
				fileRef={this.fileRef}
				onKeyFile={this.handleKeyFile}
				keyfile={this.state.keyfile}
				onKeyClear={this.handleKeyClear}
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
							<br/>
						</div>
						<div>
							<h1 className={styles.setting}>
								Arweave Keyfile (JSON):
							</h1>
							<input
							id="background"
							type="file"
							ref={this.props.fileRef}
							onChange={this.props.onKeyFile}
							/>
							<div id="showCompleted" onClick={this.props.onKeyClear} className={styles.settingButton}>
								Clear
							</div>
						</div>
						<div>
							<input type="text" value={this.props.keyfile} readOnly/>
						</div>
						<div>
							<button id="resetLocal" className={styles.button} onClick={this.props.changeSetting}>
								delete local data
							</button>
						</div>
						<div>
							<h1 className={styles.setting}>
								{"  NOTE: This will delete all Arweave transactions data!"}
							</h1>
						</div>
					</div>
				</div>
			 </div>
		);

	}
}
