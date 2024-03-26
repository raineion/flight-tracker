import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Airport from "./pages/Airport";
import Flight from "./pages/Flight/Flight";
import FlightInfo from "./pages/Flight/FlightInfo";
import FlightsList from "./pages/Flight/FlightsList";
import NotFound from "./pages/NotFound";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<Home />} />
        <Route path="/" element={<Layout />}>
          <Route path="airport" element={<Airport />}>
            <Route path="" element={<NotFound />} />
            <Route path=":infoSlug" element={<Airport />} />
          </Route>
          <Route path="/map" element={<Flight />}>
            <Route path="" element={<FlightsList />} />
            <Route path=":infoSlug" element={<FlightsList />} />
          </Route>
          <Route path="/flight-info" element={<Flight />}>
            <Route path="" element={<NotFound />} />
            <Route path=":infoSlug" element={<FlightInfo />} />
          </Route>
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));