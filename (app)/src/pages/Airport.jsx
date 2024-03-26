import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

function FlightTr(props) {
  var d = new Date(0);
  d.setUTCSeconds(props.firstSeen);
  var firstSeenTime = d.toLocaleDateString() + " " + d.toLocaleTimeString();
  var d2 = new Date(0);
  d2.setUTCSeconds(props.lastSeen);
  var lastSeenTime = d2.toLocaleDateString() + " " + d2.toLocaleTimeString();
  var className = "alert-secondary";
  var link1 = "./../flight-info/hex-" + props.icao24;
  var st = lastSeenTime;
  if (props.type == "departure") {
    st = firstSeenTime;
  }
  return (
    <tr className={className}>
      <td>
        <a href={link1}>{props.callSign}</a>
      </td>
      <td>
        <a href={props.otherAirport}>{props.otherAirport}</a>
      </td>
      <td>
        <em>{st}</em>
      </td>
    </tr>
  );
}

function Airport() {
  let { infoSlug } = useParams();

  useEffect(() => {}, [infoSlug]);

  const [reg, setReg] = useState("Unknown");
  const [aircraftData, setAircraftData] = useState({
    ICAOTypeCode: "",
    Manufacturer: "Unknown",
    ModeS: "",
    OperatorFlagCode: "",
    RegisteredOwners: "Unknown",
    Registration: "",
    Type: "",
  });
  const [arrivals, setArrivals] = useState(
    '[{"icao24":"Unknown","firstSeen":0,"estDepartureAirport":"Unknown","lastSeen":0,"estArrivalAirport":"Unknown","callsign":"No Callsign","estDepartureAirportHorizDistance":0,"estDepartureAirportVertDistance":0,"estArrivalAirportHorizDistance":0,"estArrivalAirportVertDistance":0,"departureAirportCandidatesCount":1,"arrivalAirportCandidatesCount":2}]'
  );
  const [departures, setDepartures] = useState(
    '[{"icao24":"Unknown","firstSeen":0,"estDepartureAirport":"Unknown","lastSeen":0,"estArrivalAirport":"Unknown","callsign":"No Callsign","estDepartureAirportHorizDistance":0,"estDepartureAirportVertDistance":0,"estArrivalAirportHorizDistance":0,"estArrivalAirportVertDistance":0,"departureAirportCandidatesCount":1,"arrivalAirportCandidatesCount":2}]'
  );
  const [airportData, setAirportData] = useState(
    '{"airport":"Unknown","country_code":"N/A","iata":"Unknown","icao":"Unknown","latitude":150,"longitude":10,"region_name":"Unknown"}'
  );
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);

  var fetchEnd = Math.round(Date.now() / 1000);
  var fetchBegin = fetchEnd - 86400;
 
 var fetchurl0 = "https://opensky-network.org/api/flights/arrival?airport="+infoSlug+"&begin="+fetchBegin+"&end="+fetchEnd ; // Real live data
 var fetchurl1 = "https://opensky-network.org/api/flights/departure?airport="+infoSlug+"&begin="+fetchBegin+"&end="+fetchEnd ; // Test data

  useEffect(() => {
    fetch("https://hexdb.io/api/v1/airport/icao/" + infoSlug)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setAirportData(responseData);
        if (typeof responseData.latitude !== "undefined") {
          setLat(responseData.latitude);
        }
        if (typeof responseData.longitude !== "undefined") {
          setLon(responseData.longitude);
        }
      })
      .catch((e) => {
        console.log(e.toString());
        setAirportData(
          '{"airport":"Unknown","country_code":"N/A","iata":"Unknown","icao":"Unknown","latitude":150,"longitude":10,"region_name":"Unknown"}'
        );
      });

    fetch(fetchurl0)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setArrivals(responseData);
      })
      .catch((e) => {
        console.log(e.toString());
        setArrivals(
          '[{"icao24":"Unknown","firstSeen":0,"estDepartureAirport":"Unknown","lastSeen":0,"estArrivalAirport":"Unknown","callsign":"No Callsign","estDepartureAirportHorizDistance":0,"estDepartureAirportVertDistance":0,"estArrivalAirportHorizDistance":0,"estArrivalAirportVertDistance":0,"departureAirportCandidatesCount":1,"arrivalAirportCandidatesCount":2}]'
        );
      });

    fetch(fetchurl1)
      .then((response) => response.json())
      .then((responseData2) => {
        console.log(responseData2);
        setDepartures(responseData2);
      })
      .catch((e) => {
        console.log(e.toString());
        setDepartures(
          '[{"icao24":"Unknown","firstSeen":0,"estDepartureAirport":"Unknown","lastSeen":0,"estArrivalAirport":"Unknown","callsign":"No Callsign","estDepartureAirportHorizDistance":0,"estDepartureAirportVertDistance":0,"estArrivalAirportHorizDistance":0,"estArrivalAirportVertDistance":0,"departureAirportCandidatesCount":1,"arrivalAirportCandidatesCount":2}]'
        );
      });
  }, []);
  var iconSize = 0;
  if(lat != 0 && lon != 0) {
    iconSize=24;
  }
  var markr = null;

  return (
    <div className="App">
      <header className="App-header">
        <div className="container-fluid mt-2">
          <div className="row">
            <div className="col-md-6">
              <h3>{airportData?.airport}</h3>
              <p>
                <strong>ICAO code: </strong>
                {airportData?.icao}
              </p>
              <p>
                <strong>IATA code: </strong>
                {airportData?.iata}
              </p>
              <p>
                <strong>Country: </strong>
                {airportData?.country_code}{" "}
              </p>
              <p>
                <strong>Longitude: </strong>
                {airportData?.longitude}{" "}
              </p>
              <p>
                <strong>Latitude: </strong>
                {airportData?.latitude}{" "}
              </p>
            </div>
            <div className="col-md-6">
              {airportData ? (
                <MapContainer
                  id="airport-map"
                  center={[lat, lon]}
                  zoom={1}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={[lat, lon]}
                    title={airportData?.airport}
                    icon={
                      new Icon({
                        iconUrl: "./../location.png",
                        iconSize: [iconSize, iconSize],
                      })
                    }
                  ></Marker>
                </MapContainer>
              ) : null}
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h3>Recent departures</h3>
              <table className="previous-flights">
                <thead>
                  <tr>
                    <th>Callsign</th>
                    <th>To</th>
                    <th>Est. departure</th>
                  </tr>
                </thead>
                <tbody>
                  {departures[0] ? (
                    <FlightTr
                      type="departure"
                      icao24={departures[0].icao24}
                      otherAirport={departures[0].estArrivalAirport}
                      firstSeen={departures[0].firstSeen}
                      lastSeen={departures[0].lastSeen}
                      callSign={departures[0].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {departures[1] ? (
                    <FlightTr
                      type="departure"
                      icao24={departures[1].icao24}
                      otherAirport={departures[1].esArrivalAirport}
                      firstSeen={departures[1].firstSeen}
                      lastSeen={departures[1].lastSeen}
                      callSign={departures[1].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {departures[2] ? (
                    <FlightTr
                      type="departure"
                      icao24={departures[2].icao24}
                      otherAirport={departures[2].estArrivalAirport}
                      firstSeen={departures[2].firstSeen}
                      lastSeen={departures[2].lastSeen}
                      callSign={departures[2].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {departures[3] ? (
                    <FlightTr
                      type="departure"
                      icao24={departures[3].icao24}
                      otherAirport={departures[3].estArrivalAirport}
                      firstSeen={departures[3].firstSeen}
                      lastSeen={departures[3].lastSeen}
                      callSign={departures[3].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {departures[4] ? (
                    <FlightTr
                      type="departure"
                      icao24={departures[4].icao24}
                      otherAirport={departures[4].estArrivalAirport}
                      firstSeen={departures[4].firstSeen}
                      lastSeen={departures[4].lastSeen}
                      callSign={departures[4].callsign}
                      status="Landed"
                    />
                  ) : null}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h3>Recent Arrivals</h3>
              <table className="previous-flights">
                <thead>
                  <tr>
                    <th>Callsign</th>
                    <th>From</th>
                    <th>Est. arrival</th>
                  </tr>
                </thead>
                <tbody>
                  {arrivals[0] ? (
                    <FlightTr
                      type="arrival"
                      icao24={arrivals[0].icao24}
                      otherAirport={arrivals[0].estDepartureAirport}
                      firstSeen={arrivals[0].firstSeen}
                      lastSeen={arrivals[0].lastSeen}
                      callSign={arrivals[0].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {arrivals[1] ? (
                    <FlightTr
                      type="arrival"
                      icao24={arrivals[1].icao24}
                      otherAirport={arrivals[1].estDepartureAirport}
                      firstSeen={arrivals[1].firstSeen}
                      lastSeen={arrivals[1].lastSeen}
                      callSign={arrivals[1].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {arrivals[2] ? (
                    <FlightTr
                      type="arrival"
                      icao24={arrivals[2].icao24}
                      otherAirport={arrivals[2].estDepartureAirport}
                      firstSeen={arrivals[2].firstSeen}
                      lastSeen={arrivals[2].lastSeen}
                      callSign={arrivals[2].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {arrivals[3] ? (
                    <FlightTr
                      type="arrival"
                      icao24={arrivals[3].icao24}
                      otherAirport={arrivals[3].estDepartureAirport}
                      firstSeen={arrivals[3].firstSeen}
                      lastSeen={arrivals[3].lastSeen}
                      callSign={arrivals[3].callsign}
                      status="Landed"
                    />
                  ) : null}
                  {arrivals[4] ? (
                    <FlightTr
                      type="arrival"
                      icao24={arrivals[4].icao24}
                      otherAirport={arrivals[4].estDepartureAirport}
                      firstSeen={arrivals[4].firstSeen}
                      lastSeen={arrivals[4].lastSeen}
                      callSign={arrivals[4].callsign}
                      status="Landed"
                    />
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Airport;
