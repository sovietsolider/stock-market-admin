import './brokers.style.css';
import React, {Component, useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function AddBroker() {
    let name = "";
    let money = 0;
    const navigate = useNavigate();

    let submitEdit = () => {
        axios.post("http://localhost:5000/addbroker", {name: name, money: money}).then(()=>{
            navigate("/brokers")});
    }

    let handleName = (e) => name=e.target.value;
    let handleMoney = (e) => money=e.target.value;

    let renderBrokersEdit = () => {
        return <>
            <div className="container w-50 mt-3">
                <input className="form-control mb-3" type="text" onChange={handleName} placeholder="Name"/>
                <input className="form-control mb-3" type="number" onChange={handleMoney} placeholder="money"/>
                <button className="btn btn-success" onClick={submitEdit}>Add broker</button>
            </div>
        </>
    }

    return renderBrokersEdit();
}


