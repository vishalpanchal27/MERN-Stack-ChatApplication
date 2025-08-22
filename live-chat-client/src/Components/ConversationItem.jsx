import React from 'react'
import './MainContainer.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { openChat } from '../redux/Slices/chatwithSlice'

const ConversationItem = ({ person, lastMessage }) => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  //ye commet reflect kiyo nhi ho reha

  const handleChat = () => {
    dispatch(openChat(person));
    navigate('chat');
  };

  const messageText = lastMessage?.message || "Say Hello to your new friend!";
  const sortMessage = messageText.length > 30 ? `${messageText.slice(0, 30)}...` : messageText;

  const time = lastMessage?.time
    ? new Date(lastMessage.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "";

  return (
    <div
      className={`conversation-container ${theme ? "" : "dark-themeShade"}`}
      onClick={handleChat}
      key={person._id}
    >
      <p className={`con-icon ${theme ? "iconTextLight" : ""}`}>
        <img className="con-imageIcon" src={person.profilePicture} alt="" />
      </p>
      <p className={`con-title ${theme ? "" : "iconTextLight"}`}>
        {person.userName}
      </p>
      <p className={`con-message ${theme ? "" : "iconTextLight"}`}>
        {sortMessage || 'New User'}
      </p>
      <p className={`con-timeStamp ${theme ? "" : "iconTextLight"}`}>
        {time}
      </p>
    </div>
  );
};


export default ConversationItem
