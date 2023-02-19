import './exchange.style.css';
import React, {Component, useEffect, useRef, useState} from 'react';
import axios from "axios";
import ReactDOM from "react-dom/client";
import {useDispatch, useSelector, useStore} from "react-redux";
import io from 'socket.io-client';
import {socket, SocketContext} from "../socket/socket"
import {stockSlice} from "../store/stockSlice";

console.log(sessionStorage.getItem("isConnected"))

export default function Exchange() {
    console.log("RENDERING");
    let dispatch = useDispatch();
    const socket = React.useContext(SocketContext);
    let stockToEmulate = useSelector((state) => state.stock)
    let currentDate = useSelector((state) => state.stock.currentDate);
    let currentPrices = useSelector((state) => {
        let tags = [];
        for(let i in state.stock.prices) {
            tags.push({tag: i, price: state.stock.prices[i]});
        }
        return tags;
    });
    let startingDate = "10/18/2022";
    //let startingSpeed = 0;

    const [allStock, setAllStock] = useState({});
    const [speed, setSpeed] = useState(0);

    const getAllStock = async () => {
        const response = await axios.get("http://localhost:5000/getAllStock");
        return response.data;
    };

    if(sessionStorage.getItem("isConnected") !== "1") {
        socket.on('message', (data) => {
            console.log(data)
            dispatch(stockSlice.actions.setCurrentPrices(data.currentPrices));
            dispatch(stockSlice.actions.setCurrentDate(data.date))
        })
        sessionStorage.setItem("isConnected", "1");
    }

    useEffect(() => {
        getAllStock().then(
            result => {
                setAllStock(result)
            });

    }, []);

    let handleDateChange = (event) => {
        startingDate = event.target.value;
    }

    let handleSpeedChange = (event) => {
        //startingSpeed = event.target.value;
        setSpeed(event.target.value);
    }

    let renderStockToEmulate = () => {
        //console.log(currentPrices);
        let cards = [];
        currentPrices.map((v) => {
            cards.push(
                <div className="card text-white bg-dark mb-3">
                    <div className="card-header">Stock</div>
                    <div className="card-body">
                        <h5 className="card-title">{v.tag}</h5>
                        <p className="card-text">Price: {v.price}</p>
                        <p className="card-text">Date: {currentDate}</p>
                    </div>
                </div>
            )
        })
        return cards;
    }

    let startEmulating = () => {
        console.log(currentPrices);

        axios.post("http://localhost:5000/test", {emulatingStocks: stockToEmulate, startingDate: startingDate, startingSpeed: speed});

    }

    let stopEmulating = () => {
        axios.post("http://localhost:5000/stopemulating", {emulatingStocks: stockToEmulate});
    }

    let ExchangeRender = () => {
        console.log("Exchange Render")
        return <>
            <div className="container mt-3 w-50">
                <p className="mb-1">Date</p>
                <input className="form-select" type="date" min="2021-10-19" max="2022-10-18" onChange={handleDateChange}/>
                <p className="mt-1 mb-1">Speed</p>
                <input className="form-select mb-3" type="number" placeholder="Seconds" min={1}  onChange={handleSpeedChange}/>
                <button className="btn btn-success me-2" onClick={startEmulating}>Start emulating</button>
                <button className={"btn btn-danger"}  onClick={stopEmulating}>Stop emulating</button>
                <div className="mt-3">
                    {renderStockToEmulate()}
                </div>
            </div>

        </>
    }

    return ExchangeRender()

}


