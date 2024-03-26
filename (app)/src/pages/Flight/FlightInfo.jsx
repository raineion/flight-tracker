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

function StatusAlert(props) {
  var verb = "is";
  var statusColor = "secondary";
  var symbol = "¡";
  if (props.onGround == false) {
    verb = " is in the air";
    statusColor = "success";
    symbol = "✓";
  } else if (props.callSign == "No Callsign") {
    verb = " is not live";
    statusColor = "secondary";
    symbol = "🛈";
  } else if (props.onGround == true) {
    verb = "is on the ground";
    statusColor = "success";
    symbol = "✓";
  } else {
    verb = "s status is unknown";
    statusColor = "secondary d-none";
    symbol = "x";
  }
  var className = "alert alert-" + statusColor;
  return (
    <div className={className}>
      <strong>{symbol}</strong> This flight {verb}
    </div>
  );
}

function FlightInfo() {
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
  const [planeImgSrc, setPlaneImgSrc] = useState(null);
  const dataList = infoSlug;
  const inputCheck = dataList.split("-");
  const [liveData, setLiveData] = useState(null);
  const [origin, setOrigin] = useState(".");
  const [destination, setDestination] = useState(".");
  const [callSign, setCallSign] = useState("No Callsign");
  const [lat1, setLat1] = useState(0);
  const [lon1, setLon1] = useState(0);
  const [lat2, setLat2] = useState(0);
  const [lon2, setLon2] = useState(0);
  const [originData, setOriginData] = useState(
    '{"airport":"Unknown","country_code":"N/A","iata":"Unknown","icao":"Unknown","latitude":150,"longitude":10,"region_name":"Unknown"}'
  );
  const [destinationData, setDestinationData] = useState(
    '{"airport":"Unknown","country_code":"N/A","iata":"Unknown","icao":"Unknown","latitude":150,"longitude":10,"region_name":"Unknown"}'
  );
  var inputType = "";
  var hexCode = "";
  if (inputCheck[0] == "hex" && typeof inputCheck[1] !== "undefined") {
    inputType = "hex";
    hexCode = inputCheck[1];


    var fetchurl0 = "https://hexdb.io/hex-image-thumb?hex=" + hexCode; 
    var fetchurl1 = `https://hexdb.io/api/v1/aircraft/` + hexCode; 
     var fetchurl2 = `https://opensky-network.org/api/states/all?icao24=`+hexCode; 
  }



  useEffect(() => {
    fetch(fetchurl0).then((r) => {
      r.text().then((d) => {
        setPlaneImgSrc("https:" + d);
      });
    });
    fetch(fetchurl1)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setAircraftData(responseData);

      })
      .catch((e) => {
        console.log(e.toString());
      });
    fetch(fetchurl2)
      .then((response) => response.json())
      .then((responseData2) => {
        console.log(responseData2);
        if (responseData2.states[0][6] == null) {
          setLiveData({
            time: 1671324411,
            states: [
              [
                "",
                "No Callsign",
                "Unknown",
                1000000000,
                1000000000,
                0,
                0,
                0,
                true,
                0,
                0,
                0,
                null,
                0,
                null,
                false,
                0,
              ],
            ],
          });
        } else if (
          responseData2.states[0][8] !== true &&
          responseData2.states[0][8] !== false
        ) {
          setLiveData({
            time: 1671324411,
            states: [
              [
                "",
                "No Callsign",
                "Unknown",
                1000000000,
                1000000000,
                0,
                0,
                0,
                true,
                0,
                0,
                0,
                null,
                0,
                null,
                false,
                0,
              ],
            ],
          });
        } else {
          setLiveData(responseData2);
          fetch(
            "https://hexdb.io/callsign-route-iata?callsign=" +
              responseData2?.states[0][1]
          )
            .then((r) => {
              r.text().then((d) => {
                var ornden = d.split("-");
                var org = "Unknown";
                var dst = "Unknown";
                if (typeof ornden[0] !== "undefined") {
                  org = ornden[0];
                }
                if (typeof ornden[1] !== "undefined") {
                  dst = ornden[1];
                }
                setOrigin(org);
                setDestination(dst);

                fetch("https://hexdb.io/api/v1/airport/iata/" + org)
                  .then((response) => response.json())
                  .then((responseData3) => {
                    console.log(responseData3);
                    setOriginData(responseData3);
                    if (
                      typeof responseData3.latitude !== "undefined" &&
                      typeof responseData3.longitude !== "undefined"
                    ) {
                      setLat1(responseData3.latitude);
                      setLon1(responseData3.longitude);
                    }
                  })
                  .catch((e) => {
                    console.log(e.toString());
                    setOriginData(
                      '{"airport":"Unknown","country_code":"N/A","iata":"Unknown","icao":"Unknown","latitude":150,"longitude":20,"region_name":"Unknown"}'
                    );
                  });

                fetch("https://hexdb.io/api/v1/airport/iata/" + dst)
                  .then((response) => response.json())
                  .then((responseData4) => {
                    console.log(responseData4);
                    setDestinationData(responseData4);
                    if (
                      typeof responseData4.latitude !== "undefined" &&
                      typeof responseData4.longitude !== "undefined"
                    ) {
                      setLat2(responseData4.latitude);
                      setLon2(responseData4.longitude);
                    }
                  })
                  .catch((e) => {
                    console.log(e.toString());
                    setDestinationData(
                      '{"airport":"Unknown","country_code":"N/A","iata":"Unknown","icao":"Unknown","latitude":150,"longitude":20,"region_name":"Unknown"}'
                    );
                  });
              });
            })
            .catch((e) => {
              console.log(e.toString());
              setOrigin("Unknown");
              setDestination("Unknown");
            });

          // Refresh flight every 15 seconds
          const intervalRefresh = setInterval(() => {
            fetch(fetchurl2)
              .then((response) => response.json())
              .then((responseData2) => {
                console.log(responseData2);
                if (responseData2.states[0][6] == null) {
                  setLiveData({
                    time: 1671324411,
                    states: [
                      [
                        "",
                        "No Callsign",
                        "Unknown",
                        1000000000,
                        1000000000,
                        0,
                        0,
                        0,
                        true,
                        0,
                        0,
                        0,
                        null,
                        0,
                        null,
                        false,
                        0,
                      ],
                    ],
                  });
                } else if (
                  responseData2.states[0][8] !== true &&
                  responseData2.states[0][8] !== false
                ) {
                  setLiveData({
                    time: 1671324411,
                    states: [
                      [
                        "",
                        "No Callsign",
                        "Unknown",
                        1000000000,
                        1000000000,
                        0,
                        0,
                        0,
                        true,
                        0,
                        0,
                        0,
                        null,
                        0,
                        null,
                        false,
                        0,
                      ],
                    ],
                  });
                } else {
                  setLiveData(responseData2);
                }
              })
              .catch((e) => {
                console.log(e.toString());
                setLiveData({
                  time: 1671324411,
                  states: [
                    [
                      "",
                      "No Callsign",
                      "Unknown",
                      1000000000,
                      1000000000,
                      0,
                      0,
                      0,
                      true,
                      0,
                      0,
                      0,
                      null,
                      0,
                      null,
                      false,
                      0,
                    ],
                  ],
                });
              });
          }, 10000); // How often flight status refreshes in milliseconds, change to a smaller number if you want it to refresh more often

          return () => clearInterval(intervalRefresh);

        }
      })
      .catch((e) => {
        console.log(e.toString());
        setLiveData({
          time: 1671324411,
          states: [
            [
              "",
              "No Callsign",
              "Unknown",
              1000000000,
              1000000000,
              0,
              0,
              0,
              true,
              0,
              0,
              0,
              null,
              0,
              null,
              false,
              0,
            ],
          ],
        });
      });
  }, []);


  const customIcon = new Icon({
    iconUrl: "./../directions/d45.png",
    iconSize: [28, 28],
  });
  var size = 28;
  if (liveData?.states[0][1] == "No Callsign") {
    size = 0;
  }
  return (
    <div className="App">
      <header className="App-header">
        <div className="container-fluid">
          <h3>{liveData?.states[0][1]}</h3>
          <p className="text-muted text-small">
            {liveData ? (
              <span>
                Last update on{" "}
                {new Date(liveData?.states[0][4] * 1000).toLocaleDateString(
                  "default"
                )}{" "}
                at{" "}
                {new Date(liveData?.states[0][4] * 1000).toLocaleTimeString(
                  "default"
                )}
              </span>
            ) : null}
          </p>
          <div className="row">
            <div className="col-md-6">
              <div className="map" id="map">
                {liveData ? (
                  <MapContainer
                    center={[liveData?.states[0][6], liveData?.states[0][5]]}
                    zoom={3}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {originData ? (
                      <Marker
                        position={[lat1, lon1]}
                        icon={
                          new Icon({
                            iconUrl: "./../location.png",
                            iconSize: [size, size],
                          })
                        }
                      >
                        <Popup>
                          {originData?.airport}
                          <br />
                          <img
                            className="country-flag"
                            crossOrigin="anonymous"
                            src={
                              "https://countryflagsapi.com/png/" +
                              originData?.country_code
                            }
                          />{" "}
                          ({origin})
                        </Popup>
                      </Marker>
                    ) : null}
                    {
                      <Polyline
                        pathOptions={{
                          color: "#909090",
                          fill: false,
                          weight: 2,
                          dashArray: "10,10",
                          dashOffset: "0",
                        }}
                        positions={[
                          [lat1, lon1],
                          [liveData?.states[0][6], liveData?.states[0][5]],
                          [lat2, lon2],
                        ]}
                      />
                    }
                    {destinationData ? (
                      <Marker
                        position={[lat2, lon2]}
                        icon={
                          new Icon({
                            iconUrl: "./../location.png",
                            iconSize: [size, size],
                          })
                        }
                      >
                        <Popup>
                          {destinationData?.airport}
                          <br />
                          <img
                            className="country-flag"
                            crossOrigin="anonymous"
                            src={
                              "https://countryflagsapi.com/png/" +
                              destinationData?.country_code
                            }
                          />{" "}
                          ({destination})
                        </Popup>
                      </Marker>
                    ) : null}
                    <Marker
                      position={[
                        liveData?.states[0][6],
                        liveData?.states[0][5],
                      ]}
                      icon={
                        new Icon({
                          iconUrl:
                            "./../directions/d" +
                            Math.floor((liveData.states[0][10] + 23) / 45) *
                              45 +
                            ".png",
                          iconSize: [size, size],
                        })
                      }
                    >
                    </Marker>
                  </MapContainer>
                ) : null}
              </div>
            </div>
            <div className="col-md-6 p-6">
              <StatusAlert
                onGround={liveData?.states[0][8]}
                callSign={liveData?.states[0][1]}
              />
              <h4>Flight information</h4>
              <table className="flight-route alert-secondary">
                <tbody>
                  <tr>
                    <td>
                      <strong>From</strong>
                    </td>
                    <td>
                      <strong>To</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {originData.airport}
                      <br />
                      <img
                        className="country-flag"
                        crossOrigin="anonymous"
                        src={
                          "https://countryflagsapi.com/png/" +
                          originData.country_code
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "./../flagtemp.png";
                        }}
                      />{" "}
                      ({origin})
                    </td>
                    <td>
                      {destinationData.airport}
                      <br />
                      <img
                        className="country-flag"
                        crossOrigin="anonymous"
                        src={
                          "https://countryflagsapi.com/png/" +
                          destinationData.country_code
                        }
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src = "./../flagtemp.png";
                        }}
                      />{" "}
                      ({destination})
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Altitude</strong>
                    </td>
                    <td>
                      <strong>Ground speed</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>{Math.round(liveData?.states[0][7] * 3.2808)} feet</td>
                    <td>
                      {Math.round((liveData?.states[0][9] * 18) / 5)} Km/h
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="row mt-4">
                <div className="col-md-6 mb-2">
                  <h4>Plane information</h4>
                  <p>
                    <strong>Reg:</strong> {aircraftData?.Registration}
                  </p>
                  <p>
                    <strong>Type:</strong> {aircraftData?.Manufacturer}{" "}
                    {aircraftData?.Type}
                  </p>
                  <p>
                    <strong>Airline:</strong> {aircraftData?.RegisteredOwners}
                  </p>
                  <p>
                    <strong>Hex code:</strong> {aircraftData?.ModeS}
                  </p>
                  <p>
                    <strong>Operator code:</strong>{" "}
                    {aircraftData?.OperatorFlagCode}
                  </p>
                </div>
                <div className="col-md-6">
                  <img
                    id="plane-image"
                    src={planeImgSrc}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "./../aircrafttemp.png";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default FlightInfo;
