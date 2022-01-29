import Map from "./components/Map.js";
import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [long, setLong] = useState(0.12);
  const [lati, setLati] = useState(51);
  const [locked, setLock] = useState(true);
  const [lockMsg, setTxt] = useState("Unlock from ISS");

  useEffect(() => {
    getInitLocation();
  }, []);

  const getInitLocation = async () => {
    setLoading(true);

    const response = await axios.get("http://api.open-notify.org/iss-now.json");
    console.log("loading set");
    const { longitude, latitude } = await response.data.iss_position;
    setLong(parseFloat(longitude));
    setLati(parseFloat(latitude));
    console.log(response);
    setLoading(false);
    updateHandler();
  };

  useEffect(() => {
    (function selfCall() {
      updateHandler();
      setTimeout(selfCall, 2000);
    })();
  }, []);

  const updateHandler = async () => {
    const response = await axios.get("http://api.open-notify.org/iss-now.json");
    const { longitude, latitude } = await response.data.iss_position;
    setLong(parseFloat(longitude));
    setLati(parseFloat(latitude));
  };
  const lockOn = () => {
    if (locked === false) {
      console.log("locking on");
      setLock(true);
      setTxt("Lock to ISS");
    } else {
      setLock(false);
      setTxt("Unlock from ISS");
    }
  };

  return (
    <>
      {!loading ? (
        <>
          <div className="map-container">
            <Map
              issPos={{ lat: lati, lng: long }}
              center={!locked ? { lat: lati, lng: long } : {}}
              zoom={4}
            />
          </div>
          <button
            onClick={() => {
              lockOn();
            }}
            className="lock-on-button"
          >
            {lockMsg}
          </button>
        </>
      ) : (
        <div className="Loading">Loading...</div>
      )}
    </>
  );
}

export default App;
