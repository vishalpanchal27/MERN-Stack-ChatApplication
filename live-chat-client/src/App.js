import './App.css';
import MainContainer from './Components/MainContainer';
import { Routes, Route } from 'react-router-dom'
import Welcome from './Components/Welcome';
import UserWelcomePage from './Components/UserWelcomePage';
import ChatArea from './Components/ChatArea';
import CreateGroup from './Components/CreateGroup';
import OnlineUsers from './Components/OnlineUsers';
import Groups from './Components/Groups';
import { useSelector } from 'react-redux';
import LoginPage from './Components/LoginPage';
import SignUpPage from './Components/SignUpPage';

function App() {
  const theme = useSelector((state) => state.theme)
  return (
    <div className={`mainContainer ${theme ? '' : 'dark-themeShadeDarkest'} `}>
      <Routes>
        <Route path='/' element={<Welcome />}>
          <Route path='loginPage' element={<LoginPage />} />
          <Route path='signUpPage' element={<SignUpPage />} />
        </Route>
        <Route path='app' element={<MainContainer />} >
          <Route path='welcome' element={<UserWelcomePage />} />

          <Route path='Chat' element={<ChatArea />} />
          <Route path='create-group' element={<CreateGroup />} />
          <Route path='online-users' element={<OnlineUsers />} />
          <Route path='groups' element={<Groups />} />
        </Route>
      </Routes>


    </div>
  );
}

export default App;
