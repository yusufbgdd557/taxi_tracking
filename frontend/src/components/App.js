import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import MainPage from "./Main/MainPage";
import Maps from "./Maps/Maps";
import Search from "./Search/Search";
import Instant from "./Instant/Instant";
import useToken from '../Hooks/useToken';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { token, removeToken, setToken, email, removeEmail, setEmail, updateToken } = useToken();
  return (
    <BrowserRouter>
      <ToastContainer />
      {!token && token !== "" && token !== undefined ?
        <Login setToken={setToken} setEmail={setEmail} /> : (
          <>
            <Navbar logout={removeToken} removeEmail={removeEmail} email={email} />
          </>
        )}
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/instant" element={<Instant email={email} token={token} updateToken={updateToken} />} />
        <Route path="/maps" element={<Maps email={email} token={token} updateToken={updateToken} />} />
        <Route path="/Search" element={<Search email={email} token={token} updateToken={updateToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
