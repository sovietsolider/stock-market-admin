import {Body, Controller, Get, Param, Post, Res} from '@nestjs/common';
import { AppService } from './app.service';
import * as brokers from '../JSON/brokers.json'
import * as stock from '../JSON/stock.json'
import {EmulateDto} from "../dtos/EmulateDto";
import {BrokersDto} from "../dtos/BrokersDto";
import {EditBrokerDto} from "../dtos/EditBrokerDto";
import {SetTakePartDto} from "../dtos/SetTakePartDto";
import {UpdateStocksDto} from "../dtos/UpdateStocksDto";
let isEmulating = false;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get("/getAllBrokers")
  getAllBrokers(): string {
    console.log("GETTING BROKERS");
    return JSON.stringify(brokers);
  }

  @Get("/getbrokerbyid")
  getBrokerById(@Param() params): string {
    for(let i of brokers) {
      if(i.broker_id == params.id) {
        return JSON.stringify(i);
      }
    }
  }

  @Get("/getAllStock")
  getAllStock(): string {
    console.log("GETTING STOCK");
    return JSON.stringify(stock);
  }

  @Post("/test")
  testSocket(@Body() body: EmulateDto): void {
    isEmulating = true;
    console.log("TESTING")
    this.appService.emulateExchange(body.emulatingStocks.stock, body.startingDate, body.startingSpeed, brokers);
  }

  @Post("/stopemulating")
  stopEmulating(): void {
    isEmulating = false;
    console.log("STOP EMULATING")
    this.appService.stopExchange();
  }

  @Post("/addbroker")
  addBroker(@Body() body: BrokersDto): void {
    brokers.push({broker_id: brokers.at(-1).broker_id+1, name: body.name, money: body.money, take_part: false, stocks: []})
    console.log(brokers);
  }

  @Post("/editbroker")
  editBroker(@Body() body: EditBrokerDto): void {
    console.log("BODY ID "+body.broker_id);
    console.log(body.name, body.money);
    for(let v of brokers) {
      console.log(v.broker_id);
      if(v.broker_id == body.broker_id)
      {
        console.log(v.broker_id);
        v.name = body.name;
        v.money = body.money;
      }
    }
  }

  @Post("/setbrokertakepart")
  setTakePart(@Body() body: SetTakePartDto): void {
    console.log(body.broker_id)
    for(let v of brokers) {
      if(v.broker_id == body.broker_id)
      {
        v.take_part = body.take_part;
      }
    }
  }


  @Post("/deletebroker")
  deleteBroker(@Body() body: EditBrokerDto): void {
    for(let v in brokers) {
      if(brokers[v].broker_id == body.broker_id) {
        console.log(v);
        brokers.splice(Number(v), 1);
      }
    }
  }

  @Get("/getbrokerstakepart")
  getBrokersTakesPart(): string {
    let tmp = [];
    for(let broker of brokers) {
      if(broker.take_part) {
        tmp.push(broker);
      }
    }
    return JSON.stringify(tmp);
  }

  @Get("/getbrokersnottakepart")
  getBrokersNotTakesPart(): string {
    let tmp = [];
    for(let broker of brokers) {
      if(!broker.take_part) {
        tmp.push(broker);
      }
    }
    return JSON.stringify(tmp);
  }

  @Post("/buystock")
  updateBrokerStock(@Body() body: UpdateStocksDto): void {
    for(let broker of brokers) {
      console.log(body.broker_id)
      if(broker.broker_id == body.broker_id && (broker.money - body.price*body.amount) > 0 && isEmulating) {
        for(let stock of broker.stocks) {
          if(stock.name == body.stock) {
            stock.amount += body.amount;
            broker.money -= Number(body.price*body.amount);
            stock.profit = Number(body.price);
            stock.profit -= Number(body.price*body.amount);
            console.log(broker.stocks);
            return;
          }
        }
        console.log("BUYING")
        broker.stocks.push({name: body.stock, amount: body.amount, profit: -body.price*body.amount});
        broker.money -= body.price*body.amount;
        console.log(broker.stocks);
      }
    }
  }

  @Post("/sellstock")
  sellStock(@Body() body: UpdateStocksDto): void {
    for(let broker of brokers) {
      console.log(body.broker_id)
      if(broker.broker_id == body.broker_id) {
        for(let stock of broker.stocks) {
          if(stock.name == body.stock && isEmulating && (stock.amount - body.amount) >= 0) {
            stock.amount -= Number(body.amount);
            broker.money += Number(body.price*body.amount);
            stock.profit += Number(body.price*body.amount);
            console.log(broker.stocks);
            return;
          }
        }
      }
    }
  }
}
