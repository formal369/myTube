import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Auth from '../hoc/auth';
import NavBar from "./views/NavBar/NavBar";

import LandingPage from '../components/views/LandingPage/LandingPage';
import LoginPage from '../components/views/LoginPage/LoginPage';
import RegisterPage from '../components/views/RegisterPage/RegisterPage';
import VideoUploadPage from '../components/views/VideoUploadPage/VideoUploadPage';
import VideoDetailPage from '../components/views/VideoDetailPage/VideoDetailPage';
import SubscriptionPage from '../components/views/SubscriptionPage/SubscriptionPage';


function App() {
  const AuthLandingPage = Auth(LandingPage, null);
  const AuthLoginPage = Auth(LoginPage, false);
  const AuthRegisterPage = Auth(RegisterPage, false);
  const AuthVideoUploadPage = Auth(VideoUploadPage, true);
  const AuthVideoDetailPage = Auth(VideoDetailPage, null);
  const AuthSubscriptionPage = Auth(SubscriptionPage, null);
  
  return (
    <>
      <NavBar />
      <Router>
        <Routes>
          <Route exact path="/" element={<AuthLandingPage />} />
          <Route exact path="/login" element={<AuthLoginPage />} />
          <Route exact path="/register" element={<AuthRegisterPage />} />
          <Route exact path="/video/upload" element={<AuthVideoUploadPage />} />
          <Route exact path="/video/:videoId" element={<AuthVideoDetailPage />} />
          <Route exact path="/subscription" element={<AuthSubscriptionPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
