import './brokers.style.css';
import React, {Component, useEffect, useState} from 'react';
import axios from "axios";
import ReactDOM from "react-dom/client";
import {useNavigate} from "react-router-dom";

export default function Brokers() {
    const navigate = useNavigate();
    const [allBrokers, setAllBrokers] = useState("");
    const getAllBrokers = async () => {
        const response = await axios.get("http://localhost:5000/getAllBrokers");
        return response.data;
    };

    let addBroker = () => {
        navigate("/addbroker");
    }

    let editBroker = (e) => {
        sessionStorage.setItem("broker_to_edit", e.target.id.split('_')[1]);
        navigate("/editbroker");
    }

    let deleteBroker = (e) => {
        sessionStorage.setItem("broker_to_delete", e.target.id.split('_')[1]);
        axios.post("http://localhost:5000/deletebroker", {broker_id: sessionStorage.getItem("broker_to_delete")}).then((data)=>window.location.reload())
    }


    function RenderBrokers() {
        useEffect(() => {
            getAllBrokers().then(
                result => setAllBrokers(result));
        }, []);
        console.log(allBrokers);
        if(allBrokers!=="") {

            return <>
                <div className="container w-50">
                    <div className="col">
                        <div className="row mt-3 mb-3">
                            <button className="btn btn-success" onClick={addBroker} style={{width:"175px"}}>Add broker</button>
                        </div>
                        {allBrokers.map((br) => (
                            <div className="row" key={"broker_card_" + br.broker_id}>
                                <div className="card text-white bg-dark mb-3">
                                    <div className="card-header">Broker</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{br.name}</h5>
                                        <p className="card-text">{br.money}</p>
                                        <div className="d-flex flex-row">
                                            <button className="btn btn-light me-2" style={{ width: "10%"}} id={"edit_"+ br.broker_id} onClick={(e)=>editBroker(e)}>Edit</button>
                                            <button className="btn btn-danger" style={{ width: "10%"}} id={"delete_"+ br.broker_id} onClick={(e)=>deleteBroker(e)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        }
        else
            return <h1>loading</h1>
    }

    return RenderBrokers();
}


