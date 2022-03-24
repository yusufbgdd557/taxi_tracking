import './MainPage.scss';
import React from 'react';
import TaxiGif from '../../assets/main-page.gif';

const MainPage = () => {
  return (
    <div className="container">
      <div className="title-container">
        <p className="title">KOCAELI UNIVERSITY</p>
        <p className="substitle">SOFTWARE LAB - 2 # PROJECT - 1</p>
      </div>
      <div className="gif-container">
        <img className="taxi-gif" src={TaxiGif} />
      </div>
    </div>
  )
}

export default MainPage
