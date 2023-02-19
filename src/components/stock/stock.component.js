import './stock.style.css';
import React, {Component, useContext, useEffect, useState} from 'react';
import axios from "axios";
import {useSelector, useDispatch, useStore} from 'react-redux';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from "react-chartjs-2"
import {ReactReduxContext} from "react-redux";
import setAll, {stockSlice} from "../store/stockSlice";
import { useNavigate } from 'react-router-dom';
import {SocketContext} from "../socket/socket";

export default function Stock() {
    let inputs = [];
    const [allStock, setAllStock] = useState([]);
    const [modalDisplay, setModalDisplay] = useState("");
    const [stockToShowInfo, setStockToShowInfo] = useState("");
    //const [checkedInputs, setCheckedInputs] = useState([]);
    let dispatch = useDispatch();
    let currentPrices = useSelector((state) => state.stock.prices);


    const getAllStock = async () => {
        const response = await axios.get("http://localhost:5000/getAllStock");
        let stock = [];
        for(const tag in response.data) {
            stock.push({tag, name: response.data[tag].name, history: response.data[tag].history});
        }
        return stock;
    };

    let getStockByTag = (tag) => {
        for(const v of allStock) {
            if(v.tag === tag)
                return v
        }
        return null
    }

    let showStockInfoModal = (e) => {
        setModalDisplay("block");
        setStockToShowInfo(e.target.id);
    }

    let closeStockInfoModal = () => {
        setModalDisplay("none");

    }
    let data = useSelector((state) => state.stock)

    let changeChecked = (pos) => {
        for(const v in inputs) {
           if(inputs[v] === pos.target.id.split('_')[1]) {

               let stock = [...inputs]
               stock.splice(v,1);
               inputs = stock;
               //setCheckedInputs(stock);
               //dispatch(stockSlice.actions.setAll(checkedInputs));
               return;
           }
        }
        let stock = [...inputs];
        stock.push(pos.target.id.split('_')[1])
        inputs = stock;
        //setCheckedInputs(stock) ;
        console.log(stock);
        //dispatch(stockSlice.actions.setAll(checkedInputs));
    }

    let sendStockToEmulate = () => {
        axios.post("http://localhost:5000/stopemulating").then(()=> dispatch(stockSlice.actions.setAll(inputs)));
        console.log(inputs);
    }
    /*
    useEffect(() => {
        dispatch(stockSlice.actions.setAll(checkedInputs));
        console.log(checkedInputs);
    }, [checkedInputs]);*/

    let renderChart= () => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            LineElement,
            Title,
            Tooltip,
            Legend
        );
        let labels = [];
        let values = [];
        for(const paper of allStock) {
            if(paper.tag === stockToShowInfo) {
                for(const v of paper.history) {
                    labels.push(v.Date);
                    values.push(v.Open);
                }
            }
        }

        const data = {
            labels: labels,
            datasets: [{
                label: stockToShowInfo,
                data: values,
                backgroundColor: 'rgb(255,255,255)',
                borderColor: 'rgb(0,0,0)'
            }]
        }
        return (<Line data={data}/>)
    }

    let renderTable = () => {
        const rows = [];
        allStock.map((v) => {
                if (v.tag === stockToShowInfo) {
                    v.history.map((d) => {
                        rows.push(
                            <tr>
                            <th scope="row" style={{width: "100%"}}>{d.Date}</th>
                            <td>{d.Open}</td>
                            </tr>)
                        }
                    )
                }
            }
        )
        return rows
    }



    function RenderBrokers() {
        useEffect(() => {
            getAllStock().then(
                result => setAllStock(result));
        }, []);

        return <>
            <div className="container w-50">
                <div className="col">
                    <div className="row mt-3 mb-3">
                        <button className="btn btn-success" onClick={sendStockToEmulate} style={{width:"175px"}}>Add to emulation</button>
                    </div>
                    {allStock.map((br) => (
                        <div className="row" key={"broker_card" + br.tag}>
                            <div className="card text-white bg-dark mb-3">
                                <div className="card-header">{br.tag}</div>
                                <div className="card-body">
                                    <h5 className="card-title">{br.name}</h5>
                                    <p id={br.tag} className="card-text info-text" style={{width: "30px"}} onClick={(e)=>showStockInfoModal(e)}>Info</p>
                                    <div className="d-flex">
                                        <p style = {{marginRight: "10px"}}>Take part in exchange</p>
                                        <input className="form-check-input text-bg-dark shadow-none" onChange={(e)=>changeChecked(e)} type="checkbox" id={"checkBox_"+br.tag}/>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
           <div className="modal modal-xl" id="stockInfoModal" style={{display: modalDisplay}}>
               <div className="modal-dialog">
                   <div className="modal-content">
                       <div className="modal-body">
                           <div className="container">
                               <table className="table table-wrapper">
                                   <thead>
                                       <tr>
                                           <th scope="col">Date</th>
                                           <th scope="col">Open</th>
                                       </tr>
                                   </thead>
                                   <tbody id="stockTBody">
                                   {renderTable()}
                                   </tbody>
                               </table>
                               {renderChart()}
                               <button className="btn btn-dark" onClick={()=>closeStockInfoModal()}>Close</button>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        </>
    }

    return RenderBrokers();
}


