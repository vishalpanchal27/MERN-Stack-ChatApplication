import React from 'react'
import mainImage from '../assets/mainImage.jpg'
const UserWelcomePage = () => {
    return (
        <div className='UWP-mainContainer'>
            <div className="UWP-image">
                <img className='UWP-mainImage' src={mainImage} alt="" />
            </div>
            <p className='UWP-text'>
                View and text directly to people present in the chat Room
            </p>
        </div>
    )
}

export default UserWelcomePage
