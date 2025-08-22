import React, { useEffect, useState } from 'react'
import mainImage from '../assets/mainImage.jpg'
import './MainContainer.css'
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import Cookies from 'universal-cookie'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addPerson } from '../redux/Slices/chatListSlice';
import GlobalVariable from '../Globals/GlobalVariable';

const OnlineUsers = () => {
    const theme = useSelector((state) => state.theme)
    const [availableUser, setAvailableUser] = useState([])
    const dispatch = useDispatch()
    const chatList = useSelector((state) => state.chatList)

    const getAvailableUsers = async () => {
        try {
            const config = {
                headers: {
                    cookies: Cookies.token
                }
            };
            const response = await axios.get('/api/users', config);
            console.log(response);
            setAvailableUser(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const addNewChat = async(user) => {
        console.log("do somthing")
        dispatch(addPerson(user))
        try {
            console.log(chatList)
            const body = { ownerId: GlobalVariable.loggedInUser._id, user: user, message: "Hii, Lets Talk" };
            const config = { headers: { "Content-Type": "application/json" } };
            const response = await axios.post("/api/friends/postSaveFriend", body, config);
            console.log("Add friend:", response.data);
        } catch (error) {
            console.error("Add friend error:", error.response?.data || error.message);
        }
    }

    useEffect(() => {
        getAvailableUsers()
    }, [])

    return (
        <div className='onlineUsers-container'>
            <div className={`onlineUsers-header ${theme ? '' : 'dark-theme'}`}>
                <img className='onlineUsers-image' src={mainImage} alt="" />
                <p className={`${theme ? '' : 'iconTextLight'}`} >Available users</p>
            </div>

            <div className="scroll-container">
                {
                    availableUser && availableUser.length > 0 &&
                    availableUser.map((user) => (
                        <div key={user._id} onClick={() => addNewChat(user)} className={`onlineUsers-users ${theme ? '' : 'dark-theme'}`}>
                            {/* <div className='onlineUsers-icon'>{user.userName[0].toUpperCase()}</div> */}
                            <div className='onlineUsers-icon' >
                                <img className='onlineUsers-imageIcon' src={user.profilePicture} alt="" srcset="" />
                            </div>
                            <div className={`onlineUsers-name ${theme ? '' : 'iconTextLight'}`}>{user.userName}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default OnlineUsers
