"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const app_gateway_1 = require("./app.gateway");
const allStock = require("../JSON/stock.json");
let AppService = class AppService {
    constructor(exchangeGateway) {
        this.exchangeGateway = exchangeGateway;
        this.curDateIndex = 0;
        this.currentPrices = {};
        this.reverseHistories = () => {
            for (let key of Object.keys(allStock)) {
                allStock[key].history.reverse();
            }
        };
        this.getDates = () => {
            let dates = [];
            for (let v of allStock.AAPL.history) {
                dates.push(v.Date);
            }
            return dates;
        };
        this.updateDate = () => {
            if (Object.keys(allStock).length !== 0) {
                let dates = this.getDates();
                if (this.curDateIndex !== dates.length - 1) {
                    this.curDateIndex += 1;
                }
                else {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }
        };
        this.getIndexByDate = (date) => {
            for (let v in allStock.AAPL.history) {
                if (allStock.AAPL.history[v].Date === date)
                    return Number(v);
            }
            return 0;
        };
        this.updatePrices = (stockToEmulate) => {
            if (Object.keys(allStock).length !== 0) {
                let dates = this.getDates();
                for (let cur of stockToEmulate) {
                    for (let v of allStock[cur].history) {
                        if (v.Date === dates[this.curDateIndex]) {
                            this.currentPrices[cur] = v.Open;
                        }
                    }
                }
            }
        };
        this.timer = null;
        this.socket = null;
        this.reverseHistories();
    }
    getHello() {
        return 'Hello World!';
    }
    emulateExchange(stockToEmulate, date, speed, allbrokers) {
        let dates = this.getDates();
        console.log(this.currentPrices);
        this.currentPrices = {};
        console.log(this.currentPrices);
        let tmpDate = date.split("-");
        this.curDateIndex = this.getIndexByDate(tmpDate[1] + "/" + tmpDate[2] + "/" + tmpDate[0]);
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this.updatePrices(stockToEmulate);
            this.updateDate();
            this.exchangeGateway.server.emit("message", { currentPrices: this.currentPrices, date: dates[this.curDateIndex], allBrokers: allbrokers });
        }, speed * 1000);
    }
    stopExchange() {
        clearInterval(this.timer);
        this.timer = null;
        this.currentPrices = {};
        this.curDateIndex = 0;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_gateway_1.ExchangeGateway])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map