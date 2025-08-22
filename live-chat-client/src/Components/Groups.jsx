import React from 'react'
import './MainContainer.css'
import mainImage from '../assets/mainImage.jpg'
import { IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';

const Groups = () => {
    const theme = useSelector((state) => state.theme)
    return (
        <div className={`group-container`}>
            <div className={`group-header ${theme ? '' : 'dark-theme'}`}>
                <img src={mainImage} className='group-image' alt="" />
                <p className={`${theme ? '' : 'iconTextLight'}`}>Groups</p>
            </div>
            <div className={`group-users ${theme ? '' : 'dark-theme'}`}>
                <div className='group-icon'>G</div>
                <div className={`group-name ${theme ? '' : 'iconTextLight'}`}>Group Name</div>
            </div>
        </div>
    )
}

export default Groups
