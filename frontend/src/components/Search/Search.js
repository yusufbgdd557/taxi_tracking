import './Search.scss';
import React, { useEffect, useState } from 'react';
import MapContainer from '../MapContainer/MapContainer';
import Loader from '../Loader/Loader';
import PropTypes from 'prop-types';
import TimePicker from "react-time-picker";
import { toast } from 'react-toastify';


const Search = (props) => {
    const [taxiData, setTaxiData] = useState(null);
    const [fixedTaxiData, setFixedTaxiData] = useState(null);
    const [control, setControl] = useState(false);
    const [time1, setTime1] = useState(null)
    const [time2, setTime2] = useState(null)
    const [showMap, setShowMap] = useState(false);


    useEffect(() => {
        fetch(`http://localhost:8000/get_all_taxi/${props.email}`, {
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
                setTaxiData(data);
            });
    }, [])

    if (control) {
        setControl(false);
        window.location.href = '/search';
    }

    if (!taxiData) {
        return <Loader />;
    }

    const fixedTaxis = (firstTime, secondTime) => {
        let getFixedTaxis = []
        const date = new Date();
        const currentHours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
        const currentMins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
        const currentTime = currentHours + ":" + currentMins

        date.setMinutes(date.getMinutes() - 30);
        const previousHours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
        const previousMins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
        const previousTime = previousHours + ":" + previousMins

        if (!firstTime && !secondTime) {
            firstTime = previousTime
            secondTime = currentTime
        }
        if (firstTime && secondTime) {
            if(firstTime > secondTime) {
                let temp = firstTime
                firstTime = secondTime
                secondTime = temp
            }

            taxiData.forEach(taxi => {
                let taxiTime = taxi.time.split(" ")[1]
                if (taxiTime >= firstTime && taxiTime <= secondTime) getFixedTaxis.push(taxi);
            });
            setFixedTaxiData(getFixedTaxis);
            setShowMap(true)
        } else {
            toast.warn("lütfen aralığı giriniz")
        }
    };

    return (
        <div className='search-by-time-container'>
            <div className='search-container'>
                <div className='timepicker-container'>
                    <div className='time1'>
                        <TimePicker
                            onChange={setTime1}
                            value={time1}
                            locale="tr-TR"
                            format='HH:mm'
                            className="time1picker"
                        />
                    </div>
                    <div className='time2'>
                        <TimePicker
                            onChange={setTime2}
                            value={time2}
                            locale="tr-TR"
                            format='HH:mm'
                            className="time2picker"
                        />
                    </div>

                </div>
                <div className='button-container'>
                    <a class="peek" onClick={() => fixedTaxis(time1, time2)}>Find Taxi</a>
                </div>
            </div>
            <div className='search-map-container'>
                {showMap && <MapContainer taxiData={fixedTaxiData} />}
            </div>
        </div>

    )
}

Search.propTypes = {
    email: PropTypes.string,
    token: PropTypes.string,
    updateToken: PropTypes.func
};


export default Search