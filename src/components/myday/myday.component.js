import React from 'react';
import { useStateValue } from '../../contexts/tasks.context';

const MyDay = () => {
    const { taskData: { myDay} } = useStateValue()

    return (
        <div className="myday-container">
            This is my day 
        </div>
    );
}

export default MyDay;
