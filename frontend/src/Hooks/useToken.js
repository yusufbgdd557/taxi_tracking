import { useState } from 'react';

function useToken() {

  function getToken() {
    const userToken = localStorage.getItem('token');
    return userToken && userToken
  }

  function getEmail() {
    const userEmail = localStorage.getItem('email');
    return userEmail && userEmail
  }

  const [token, setToken] = useState(getToken());
  const [email, setEmail] = useState(getEmail());

  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  function saveEmail(userEmail) {
    localStorage.setItem('email', userEmail);
    setEmail(userEmail);
  };

  function removeToken() {
    localStorage.removeItem("token");
    setToken(null);
  }

  function removeEmail() {
    localStorage.removeItem("email");
    setEmail(null);
  }

  function updateToken() {
    fetch('/http://localhost:8000/update_jwt_token')
    .then((res) => res.json())
    .then((data) => {
      saveToken(data.access_token);
    })
  }

  return {
    setToken: saveToken,
    token,
    removeToken,
    setEmail: saveEmail,
    email,
    removeEmail,
    updateToken
  }

}

export default useToken;