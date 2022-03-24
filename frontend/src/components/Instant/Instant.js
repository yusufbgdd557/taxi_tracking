import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import MapContainer from '../MapContainer/MapContainer';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';


const Instant = props => {
    const [taxiData1, setTaxiData1] = useState(null);
    const [fixedTaxiData1, setFixedTaxiData1] = useState(null);

    const [taxiData2, setTaxiData2] = useState(null);
    const [fixedTaxiData2, setFixedTaxiData2] = useState(null);

    const [control, setControl] = useState(false);

    const noTaxi1id = "noTaxi1";
    const noTaxi2id = "noTaxi2"

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
        window.location.href = '/instant';
    }

    if (!taxiData1 || !taxiData2) {
        return <Loader />;
    }
    const date = new Date();
    const currentHours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
    const currentMins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
    const currentTime = currentHours + ":" + currentMins
    // fix taxidata 1 
    let instantTaxisLocation = []
    let noTaxiControl = 0;

    taxiData1.forEach(taxi1 => {
        let taxi1time = taxi1.time.split(" ")[1]
        if (taxi1time === currentTime) instantTaxisLocation.push(taxi1);
    });

    if (instantTaxisLocation.length === 0) {
        toast.warn(`Kullanıcının ilk taksisinin anlık konumu yoktur`, {
            toastId: noTaxi1id
        })
        noTaxiControl++;
    }

    taxiData2.forEach(taxi2 => {
        let taxi2time = taxi2.time.split(" ")[1]
        if (taxi2time === currentTime) instantTaxisLocation.push(taxi2);
    });

    if (instantTaxisLocation.length === 0 || (instantTaxisLocation.length === 1 && noTaxiControl === 0) ) {
        toast.warn(`Kullanıcının ikinci taksisinin anlık konumu yoktur`, {
            toastId: noTaxi2id
        })
    }

    return (
        <div>
            <MapContainer taxiData={instantTaxisLocation} />
        </div>
    )
}

Instant.propTypes = {
    email: PropTypes.string,
    token: PropTypes.string,
    updateToken: PropTypes.func
}

export default Instant