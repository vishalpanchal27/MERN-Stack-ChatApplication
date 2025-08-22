import React, { useState, useEffect } from 'react';
import './MainContainer.css';
import {
    AccountCircle as AccountCircleIcon,
    PersonAdd as PersonAddIcon,
    GroupAdd as GroupAddIcon,
    WbSunny as WbSunnyIcon,
    Logout as LogoutIcon,
    AddCircle as AddCircleIcon,
    DarkMode as DarkModeIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import ConversationItem from './ConversationItem';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/Slices/themeSlice';
import axios from 'axios';

const Sidebar = () => {
    const theme = useSelector((state) => state.theme);
    const chatList = useSelector((state) => state.chatList);
    const [friendList, setFriendList] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUser = JSON.parse(localStorage.getItem("userData"));

    const handleAccount = () => navigate('welcome');
    const handleOnlineUser = () => navigate('online-users');
    const handleGroups = () => navigate('groups');
    const handleCraeteGroup = () => navigate('create-group');
    const handleChat = () => navigate('chat');
    const toggleThemes = () => dispatch(toggleTheme(!theme));

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, {
                headers: { "Content-Type": "application/json" }
            });
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    const addFriend = async () => {
        try {
            console.log(chatList)
            const body = { ownerId: loggedInUser._id, user: chatList[chatList.length - 1], message: "Hii, Lets Talk" };
            const config = { headers: { "Content-Type": "application/json" } };
            const response = await axios.post("/api/friends/postSaveFriend", body, config);
            console.log("Add friend:", response.data);
        } catch (error) {
            console.error("Add friend error:", error.response?.data || error.message);
        }
    };

    const getAllFriends = async () => {
        try {
            const response = await axios.get(`/api/friends/getFriendList/${loggedInUser._id}`);
            setFriendList(response.data);
        } catch (error) {
            console.error("Error fetching friend list:", error.message);
        }
    };

    useEffect(() => {
        getAllFriends();
        addFriend()
    }, [chatList]);


    return (
        <div className='sidebar-container'>
            <div className={`sb-header ${theme ? "" : "dark-theme"}`}>
                <IconButton onClick={handleAccount}>
                    <AccountCircleIcon className={theme ? "iconTextDark" : "iconTextLight"} />
                </IconButton>
                <div>
                    <IconButton onClick={handleOnlineUser}>
                        <PersonAddIcon className={theme ? "iconTextDark" : "iconTextLight"} />
                    </IconButton>
                    <IconButton onClick={handleGroups}>
                        <GroupAddIcon className={theme ? "iconTextDark" : "iconTextLight"} />
                    </IconButton>
                    <IconButton onClick={handleCraeteGroup}>
                        <AddCircleIcon className={theme ? "iconTextDark" : "iconTextLight"} />
                    </IconButton>
                    <IconButton onClick={toggleThemes}>
                        {theme ? <DarkModeIcon /> : <WbSunnyIcon className="iconTextLight" />}
                    </IconButton>
                    <IconButton onClick={logout}>
                        <LogoutIcon className={theme ? "iconTextDark" : "iconTextLight"} />
                    </IconButton>
                </div>
            </div>

            <div className={`sb-search ${theme ? "" : "dark-theme"}`}>
                <IconButton>
                    <SearchIcon className={theme ? "iconTextDark" : "iconTextLight"} />
                </IconButton>
                <input
                    className={`sb-searchBox ${theme ? "" : "dark-theme"} ${theme ? "iconTextDark" : "iconTextLight"}`}
                    type="text"
                    placeholder="Search"
                />
            </div>

            <div className={`sb-conversation ${theme ? "" : "dark-theme"} scroll-container`}>
                {
                    friendList.length > 0 ? (
                        friendList
                            .filter((person) => person.user && Object.keys(person.user).length > 0)
                            .map((person) => (
                                <ConversationItem
                                    key={person._id}
                                    className={`sidebar-chat ${theme ? 'dark-themeShade' : ''}`}
                                    onClick={handleChat}
                                    person={person.user}
                                    lastMessage={person.lastMessage}
                                />
                            ))
                    ) : (
                        <p style={{ textAlign: 'center', color: theme ? "#000" : "#ccc" }}>No Friends</p>
                    )
                }
            </div>
        </div>
    );
};

export default Sidebar;
