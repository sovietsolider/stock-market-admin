import { Injectable } from '@nestjs/common';
import {ExchangeGateway} from "./app.gateway";
import {SchedulerRegistry, Timeout} from "@nestjs/schedule";
import * as allStock from '../JSON/stock.json'


@Injectable()
export class AppService {
  constructor(private readonly exchangeGateway: ExchangeGateway) {
      this.reverseHistories();
  }
  curDateIndex = 0;
  currentPrices = {};

 reverseHistories = () => {
   //console.log(allStock.AAPL.history);
  for(let key of Object.keys(allStock)) {
    //console.log(key);
    allStock[key].history.reverse();
  }
  //console.log(allStock.AAPL.history);
 }

 getDates = () => {
    let dates = [];
    for(let v of allStock.AAPL.history) {
      dates.push(v.Date);
    }
    return dates;
  }

  updateDate = () => {
    if(Object.keys(allStock).length !== 0) {
      let dates = this.getDates();
      if (this.curDateIndex !== dates.length - 1) {
        this.curDateIndex += 1;
      }
      else {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  getIndexByDate = (date) => {

    for(let v in allStock.AAPL.history) {
      //console.log(allStock.AAPL.history[v].Date)
      if(allStock.AAPL.history[v].Date === date)
        return Number(v);
    }
    return 0;
  }

  updatePrices = (stockToEmulate) => {
    if(Object.keys(allStock).length !== 0) {
      //console.log(stockToEmulate)
      let dates = this.getDates();
      for (let cur of stockToEmulate) {
        //console.log(allStock[cur])
        for (let v of allStock[cur].history) {
          if (v.Date === dates[this.curDateIndex]) {
            this.currentPrices[cur] = v.Open;
          }
        }
      }
    }
  }

  timer = null;
  public socket = null;
  getHello(): string {
    return 'Hello World!';
  }

  emulateExchange(stockToEmulate, date, speed, allbrokers): void{
      let dates = this.getDates();
      console.log(this.currentPrices);
      this.currentPrices = {};
      console.log(this.currentPrices);

      //console.log("SPEED: " + speed);
      let tmpDate = date.split("-");
      this.curDateIndex = this.getIndexByDate(tmpDate[1]+"/"+tmpDate[2]+"/"+tmpDate[0]);
      //this.curDateIndex = this.getIndexByDate(date.replace(/-/g, "/"));
      //console.log(this.curDateIndex)
      if(this.timer!== null) {
        clearInterval(this.timer);
      }

    this.timer = setInterval(()=>{
      this.updatePrices(stockToEmulate);
      this.updateDate();
      this.exchangeGateway.server.emit("message", {currentPrices: this.currentPrices, date: dates[this.curDateIndex], allBrokers: allbrokers})
    }, speed*1000);
  }

  stopExchange(): void {
    clearInterval(this.timer);
    this.timer = null;
    this.currentPrices = {};
    this.curDateIndex = 0;
  }
}
