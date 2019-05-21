import React from 'react';
import styles from '../styles/timer.css'

export class Stats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let button = <svg id="Layer_5" data-name="Layer 5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.52 19.15"><title>icons</title><polygon points="14.52 10.4 7.29 0 0 10.4 5.11 10.4 5.11 19.15 9.59 19.15 9.59 10.4 14.52 10.4"/></svg>

        return (
            <div className = {styles.testing}>
                {this.props.img}
            </div>
        );
    }

}