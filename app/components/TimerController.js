import React from 'react';
import styles from '../styles/timer.css'
import { Stats } from './Stats'

export class TimerController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            time: 25 * 60 * 1000, //min to seconds to milliseconds
            running: true,
            break: false,
            show_stats: false
        };
        this.change = this.change.bind(this);
        this.showStats = this.showStats.bind(this);
    }

    componentDidMount() {
        this.timerId = setInterval(
            () => this.tick(), 1000
        );
    }

    tick() {
        this.setState((prevState) => ({
            time: prevState.time - 1000
        }));

        if (this.state.time === 0) {
            if (this.state.break)
                this.setState(() => ({
                    time: 25 * 60 * 1000
                }));
            else
                this.setState(() => ({
                    time: 25 * 60 * 1000
                }));

            this.setState((prevState) => ({ break: !prevState.break }));
        }

    }

    change() {
        this.state.running ? clearInterval(this.timerId) : this.timerId = setInterval(() => this.tick(), 1000);
        this.setState((prevState) => ({ running: !prevState.running }));
    }

    showStats() {
        this.setState((prevState => ({ show_stats: !prevState.show_stats })));
    }

    render() {

        const isRun = this.state.running;
        const expand = this.state.show_stats;
        let startStop, formattedTime;

        if (isRun) {
            startStop = <svg id="Layer_4" onClick={this.change} data-name="Layer 4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.08 18.51"><title>icons</title><rect x="10.14" y="12.61" width="18.51" height="4.48" transform="translate(26.69 -10.14) rotate(90)" /><rect x="0.53" y="12.61" width="18.51" height="4.48" transform="translate(17.09 -0.53) rotate(90)" /></svg>;
        }
        else {
            startStop = <svg id="Layer_3" onClick={this.change} data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.65 18.64"><title>icons</title><polygon points="0 0 0 18.64 14.65 9.36 0 0" /></svg>
        }

        let minutes = (this.state.time % 60000) / 1000;
        formattedTime = (Math.floor(this.state.time / 60000)).toString() + ":";

        if (minutes < 10)
            formattedTime += "0" + minutes;
        else if (minutes == 0)
            formattedTime += "00";
        else
            formattedTime += minutes;

        //let end = (this.state.time%60000)/1000  == 0 ? "00" : (this.state.time%60000)/1000;

        let tag = this.state.break ? "break" : "work";

        let stats;

        if (expand) {

            stats = <svg id="Layer_5" onClick={this.showStats} data-name="Layer 5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.52 19.15"><title>icons</title><polygon points="14.52 10.4 7.29 0 0 10.4 5.11 10.4 5.11 19.15 9.59 19.15 9.59 10.4 14.52 10.4" /></svg>
        }
        else {
            stats = <svg id="Layer_5" onClick={this.showStats} data-name="Layer 5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.52 19.15"><title>icons</title><polygon points="14.52 10.4 7.29 0 0 10.4 5.11 10.4 5.11 19.15 9.59 19.15 9.59 10.4 14.52 10.4" transform="translate(15, 20) rotate(180)"/></svg>
        
        }


        return (
            //add stats
            <div className={styles.flexColumnContainer}>
                <div className={styles.flexRowContainer}>
                    {this.state.show_stats && <Stats img={startStop} />}
                </div>

                <div className={styles.flexRowContainer}>
                    <div className={styles.button}>
                        {formattedTime}
                    </div>
                    <div>
                        {tag}
                    </div>
                    <div className={styles.testing}>
                        {startStop}
                    </div>
                    <div className={styles.testing}>
                        {stats}
                    </div>
                </div>
            </div>

        );
    }
}

//timerController has the time + # of pomodoros?