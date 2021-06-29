import React from 'react';
import "./message.styles.scss"

const Message = () => {
    return (
        <div className="message-div">
            {/* icon */}
            <img src="/assets/calendar.png" alt="calendar"  style={{width: 70, marginBottom: 20}}/>
            {/* message text */}
            <h4>Focus on your day</h4>
            <p className="text-center">Get things done with the one and only Planner!</p>
        </div>
    );
}

export default Message;
