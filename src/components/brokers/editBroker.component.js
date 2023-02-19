import './brokers.style.css';
import React, {Component, useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";


export default function EditBroker() {
    let name = "";
    let money = 0;
    let broker_id = sessionStorage.getItem("broker_to_edit");
    const navigate = useNavigate();

    let submitEdit = () => {
        axios.post("http://localhost:5000/editbroker", {broker_id: broker_id,name: name, money: money}).then(()=>{
            navigate("/brokers")});
    }

    let handleName = (e) => name=e.target.value;
    let handleMoney = (e) => money=e.target.value;

    let renderBrokersEdit = () => {
        return <>
            <div className="container w-50 mt-3">
                <input className="form-control mb-3" type="text" onChange={handleName} placeholder="Name"/>
                <input className="form-control mb-3" type="number" onChange={handleMoney} placeholder="money"/>
                <button className="btn btn-success" onClick={submitEdit}>Edit</button>
            </div>
        </>
    }

    return renderBrokersEdit();
}


