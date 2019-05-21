import React from 'react';
import styles from '../styles/timer.css';
import { TimerController } from './TimerController';

export class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    render() {

        return (
            //add stats
            <div>
                <TimerController />
            </div>

        );
    }

}

//Timer - pomodoros - the actual time
//state: timerId, ....????????
//props: none?

//Actual timer
//props: the time?
//state: buttons

//Stats
//props: visibility
//state: who tf knows

//Timer
//main functionality of the buttons and time
//child: stats?????
//Timer can be the actual timer????