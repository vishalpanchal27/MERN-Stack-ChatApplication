
import React from 'react'


const MessageOthers = ({ message, time }) => {

    const isoTime = time;
    const timeOnly = new Date(isoTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className='mo-container'>
            <div className="mo-msg">
                <p className='mo-name'>
                    {message.fullName}
                </p>
                <p className='mo-message'>
                    {message.message}
                </p>
                <p className='mo-message-time'>
                    <p className='ms-message-time'>{timeOnly !== "" ? timeOnly : "12 : 00"}</p>
                </p>
            </div>
        </div>
    )
}

export default MessageOthers
