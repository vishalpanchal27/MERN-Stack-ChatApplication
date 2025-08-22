import React from 'react'
import { IconButton } from '@mui/material'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { useSelector } from 'react-redux';

const CreateGroup = () => {
    const theme = useSelector((state) => state.theme)
    return (
        <div className='CreateGroup-container'>
            <input type="text"
                placeholder='Enter Group Name / Create Group'
                className={`createGroup-input ${theme ? '' : 'dark-theme'} ${theme ? '' : 'iconTextLight'} `}
            />
            <div className='createGroup-btn'>
                <IconButton>
                    <DoneOutlineIcon className={`${theme ? '' : 'iconTextLight'}`} />
                </IconButton>
            </div>

        </div>
    )
}

export default CreateGroup
