import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { IconButton } from '@mui/material';

const MessageSelf = ({ message, time, isRead }) => {   
    
    const isoTime = time;
    const timeOnly = new Date(isoTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    return (
        <div className='ms-container'>
            
            <div className="ms-msg">
                <p className='ms-message'>
                    {message}
                </p>
                <div className="ms-timeAndIconContainer">
                    <p className='ms-message-time'>{timeOnly !== "" ? timeOnly : "12 : 00"}</p>
                    {isRead ? (
                        <DoneAllIcon className="ms-isReadIcon" />
                    ) : (
                        <DoneIcon className="ms-isReadIcon" />
                    )}
                </div>
                
            </div>
        </div>
    )
}

export default MessageSelf
