import './Maps.scss';
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import Loader from '../Loader/Loader';
import MapContainer from '../MapContainer/MapContainer';
import TimePicker from "react-time-picker";
import { toast } from 'react-toastify';


export default function Maps(props) {
  const [taxiData1, setTaxiData1] = useState(null);
  const [taxiData2, setTaxiData2] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [time, setTime] = useState(null)
  const [selectedTaxi, setSelectedTaxi] = useState(null)
  const [fixedTaxiData, setFixedTaxiData] = useState(null);

  const [control, setControl] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/get_taxi/${props.email}/1`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + props.token,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === 'Token has expired') {
          props.updateToken();
          setControl(true);
        }
        setTaxiData1(data);
      });
    fetch(`http://localhost:8000/get_taxi/${props.email}/2`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + props.token,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === 'Token has expired') {
          props.updateToken();
          setControl(true);
        }
        setTaxiData2(data);
      });
  }, [])

  if (control) {
    setControl(false);
    window.location.href = '/maps';
  }

  if (!taxiData1 || !taxiData2) {
    return <Loader />;
  }

  const fixedTaxis = () => {
    let getFixedTaxis = []

    if (!selectedTaxi) {
      toast.warn("Taxi seçiniz !");
      return null;
    }
    if (!time) {
      toast.warn("Zaman seçiniz !");
      return null
    }

    const taxis = selectedTaxi === 1 ? taxiData1 : taxiData2;

    taxis.forEach(taxi => {
      let taxiTime = taxi.time.split(" ")[1]
      if (taxiTime <= time) {
        getFixedTaxis.push(taxi);
      }
    });

    setFixedTaxiData(getFixedTaxis);
    setShowMap(true);
  }

  return (
    <div className='search-by-taxi-container'>
      <div className='search-taxi-container'>
        <div className='button-container'>
          <a class="peeked margined" onClick={() => setSelectedTaxi(1)}>Choose 1st Taxi</a>
          <a class="peeked" onClick={() => setSelectedTaxi(2)}>Choose 2nd Taxi</a>
        </div>
        <div className='timepick-container'>
          <div className='time'>
            <TimePicker
              onChange={setTime}
              value={time}
              locale="tr-TR"
              format='HH:mm'
              className="time-pick"
            />
          </div>
        </div>
        <div className='button-container'>
          <a class="peeked" onClick={() => fixedTaxis()}>Find Taxi</a>
        </div>
      </div>
      <div className='search-taxi-map-container'>
        {showMap && <MapContainer taxiData={fixedTaxiData} />}
      </div>
    </div>
  )
}

Maps.propTypes = {
  email: PropTypes.string,
  token: PropTypes.string
};
