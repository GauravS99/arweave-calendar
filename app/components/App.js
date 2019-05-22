import React from 'react';
import {Todo} from './Todo';
import styles from '../styles/app.css';
import reset from '../styles/reset.css';
import {Timer} from './Timer';
import {Calendar} from './Calendar';
import {Heading, SettingsContainer} from './Heading';
const Arweave = require('arweave/web');

function checkCookie(){
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled){
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
    }
    return cookieEnabled;
}

export class App extends React.Component{

	constructor(props){
		super(props);

    this.arweave = Arweave.default.init({
      host: '159.65.213.43',
      port: 1984
    });

		let defaultSettings ={militaryTime: false,
				showCompleted: true,
				background: ""};

		//starting date is the current date
		this.state = {
			selectedDate: new Date(),
			items: {},
			openSettings: false,
			settings: defaultSettings,
			imageError: false
		};

		this.storageType = null;
		this.keyHeader = "productlofi-";

		this.addItem = this.addItem.bind(this);
		this.handleSettingsClick = this.handleSettingsClick.bind(this);
		this.saveSettings = this.saveSettings.bind(this);
		this.editItem = this.editItem.bind(this);
		this.handleDayClick = this.handleDayClick.bind(this);
	}

	//returns the key for the selected date's list of items
	getKey(){
		return this.keyHeader + [this.state.selectedDate.getFullYear(), (this.state.selectedDate.getMonth()), this.state.selectedDate.getDate()].join("-");
	}

	componentDidMount(){

		let cookiesAllowed = checkCookie();

		if (!cookiesAllowed){
			alert("As of right now, this website requires third party cookies " +
			"to save user events and user settings. Please enable them to get the full experience. Click OK to continue to the site");
		}

		if(cookiesAllowed && typeof(Storage) !== "undefined") {  //if the browser supports local storage
		 	this.storageType = "local";

		 	let settings = JSON.parse(localStorage.getItem("settings"));
		 	if(settings){
				this.setState({settings: settings});
		 	}
		 	this.refreshData();
		}
		else{
			if(cookiesAllowed){
				alert("Sorry, your browser doesn't support web storage. \
				Changes made to the calendar as a guest will not be be saved");
			}
			this.storageType = "none";
		}
	}

	componentDidUpdate(prevProps, prevState){
		if(prevState.selectedDate !== this.state.selectedDate){
			this.refreshData();
		}
	}

	refreshData(){
		let key = this.getKey();

		//copy over items from a source
		if (this.storageType === 'local' && localStorage.getItem(key) != null){
			let data = JSON.parse(localStorage.getItem(key));
			this.setState({items: {[key]: data}});
		}
	}

	async addItem(item){
		let key = this.getKey();
    let transactionID = "";

		if(this.storageType === "local"){

      let jwk = localStorage.getItem("arweave-calendar-keyfile");
      if(jwk){
        jwk = JSON.parse(jwk);
        try{
          let arweave = this.arweave;
          //let key = await arweave.wallets.generate();
          let transaction = await arweave.createTransaction({
              data: JSON.stringify(item),
              quantity: '0',
          }, jwk);
          await arweave.transactions.sign(transaction, jwk);
          let arStatus = await arweave.transactions.post(transaction);
          if(arStatus.status == 200){
            transactionID = transaction.id;
          }
        }
        catch(err){
          console.error("Upload to Arweave was unsuccessful:" + err.message);
        }
      }

      item["arweave_transaction_id"] = transactionID;
			let data = localStorage.getItem(key);
			if(data === null){
				localStorage.setItem(key, JSON.stringify(
					[item]
				));
			}
			else{
				localStorage.setItem(key, JSON.stringify(
					JSON.parse(data).concat(item)
				));
			}
			this.refreshData();
		}
		else{
			if(this.state.items[key] === undefined){
				let temp = Object.assign({}, this.state.items);
				temp[key] = [item];
				this.setState({items: temp});
			}
			else{
				let temp = Object.assign({}, this.state.items);
				temp[key].push(item);
				this.setState({items: temp});
			}
		}
	}

	handleDayClick(timestamp){
		let date = timestamp.split("-");
		this.setState({selectedDate: new Date(parseInt(date[0]), parseInt(date[1]), parseInt(date[2]))});
	}

	editItem(type, id){
		let key = this.getKey();;
		let data;
		let original;

		if(this.storageType === "local"){
			data = JSON.parse(localStorage.getItem(key));
		}
		else{
			original = Object.assign({}, this.state.items);
			data = original[key];
		}

		//a box has been checked
		if (type === "checkbox"){
			let entry = data.find(function(element) {
				 return element.addTime === id;
			});

			entry.completed = !entry.completed;
		}

		if(this.storageType === "local"){
			localStorage.setItem(key, JSON.stringify(data));
			this.refreshData();
		}
		else{
			this.setState({items: original});
		}
	}

	handleSettingsClick(){
		this.setState({openSettings: true});
	}

	saveSettings(settingState){

		if(this.storageType === "local"){
			localStorage.setItem("settings", JSON.stringify(settingState));
		}

		this.setState({settings: settingState, openSettings: false, imageError: false});
	}

	render(){

		let items = this.state.items[this.getKey()] !== undefined?
							this.state.items[this.getKey()]:[];

		return (
			<div className = {styles.window}>
			<BackgroundImg
			settings = {this.state.settings}
			/>
			{this.state.openSettings && <SettingsContainer
				saveSettings= {this.saveSettings}
				settings = {this.state.settings}
				/>}

				<div className = {this.state.openSettings?(styles.contentBlurred):styles.content}>
					<Heading handleSettingsClick= {this.handleSettingsClick}/>
					<div id="Grid" className = {styles.gridContainer}>
						<div className = {styles.calendar}>
							<Calendar
							onDayClick = {this.handleDayClick}
							storageType = {this.storageType}
							selectedDate = {this.state.selectedDate}
							items={this.state.items}
							keyHeader={this.keyHeader}
							/>
						</div>
						<div className = {styles.todo}>
							<Todo date={this.state.selectedDate}
							storageType = {this.storageType}
							items={items}
							addItem = {this.addItem}
							editItem = {this.editItem}
							settings = {this.state.settings}
							/>
						</div>
						<div className = {styles.lofi}>
							Lofi
						</div>
						<div className = {styles.timer}>
							Timer
							<Timer />
						</div>
					</div>
				</div>
			</div>
		);
	}
}


class BackgroundImg extends React.Component{

	constructor(props){
		super(props);
		this.state = {imageError: false}
		this.handleImageError = this.handleImageError.bind(this);
	}

	handleImageError(){
		this.setState({imageError: true});
	}

	shouldComponentUpdate(nextProps, nextState){
		if(nextProps.settings.background === this.props.settings.backround){
			return false;
		}

		return true;
	}

	componentDidUpdate(prevProps, prevState){
		if(prevProps.settings.background !== this.props.settings.background){
			this.setState({imageError: false});
		}
	}

	render(){
		let source = require("../../images/defaultBackground.jpg");
		let error = null;

		if(!this.state.imageError){
			source = this.props.settings.background;
			error = this.handleImageError;
		}

		return (
			<img
			className = {styles.backgroundImage}
			src={source}
			alt="background img"
			onError={error}
			/>
		);
	}
}
