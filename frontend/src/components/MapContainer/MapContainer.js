import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { toast } from "react-toastify";
import './MapContainer.scss';


class MapContainer extends Component {

    constructor(props) {
        super(props);
        console.table(this.props.taxiData);
    }

    render() {
        return (
            <Map google={this.props.google} zoom={11} className="map-container" initialCenter={{ lat: this.props.taxiData[0].latitude, lng: this.props.taxiData[0].longitude }}>
                {this.props.taxiData.map((taxi, index) => {
                    if (taxi.latitude === 0 || taxi.longitude === 0 || index === this.props.taxiData.length) {
                        return null;
                    }
                    return <Marker key={index} id={index} position={{
                        lat: taxi.latitude,
                        lng: taxi.longitude
                    }} onClick={() => toast(`${taxi.taxi_id}. taxi ${index}. location`)} />
                })}
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("YOUR GOOGLE KEY")
})(MapContainer)
