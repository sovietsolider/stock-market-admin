import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Brokers from './components/brokers/brokers.component'
import Stock from "./components/stock/stock.component";
import Exchange from "./components/exchange/exchange.component";
import AddBroker from "./components/brokers/addBroker.component";
import EditBroker from "./components/brokers/editBroker.component";
sessionStorage.setItem("isConnected", "0");

class App extends Component {
  render() {
    return <>
    <Router>
      <nav className="navbar navbar-expand navbar-dark bg-dark" style={{paddingLeft:"1%"}}>
        <a className="navbar-brand">Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link to="/brokers" className="nav-link active">Brokers</Link>
            </li>
            <li className="nav-item active">
              <Link to="/stock" className="nav-link active">Stock</Link>
            </li>
            <li className="nav-item active">
              <Link to="/exchange" className="nav-link active">Exchange</Link>
            </li>
          </ul>
        </div>
      </nav>
          <Routes>
            <Route path="/brokers" element={<Brokers />} />
            <Route path="/stock" element={<Stock/>}/>
            <Route path="/exchange" element={<Exchange/>}/>
            <Route path="/addbroker" element={<AddBroker/>}/>
            <Route path="/editbroker" element={<EditBroker/>}/>
          </Routes>
        </Router>

    </>

  }
}
export default App;
