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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const brokers = require("../JSON/brokers.json");
const stock = require("../JSON/stock.json");
const EmulateDto_1 = require("../dtos/EmulateDto");
const BrokersDto_1 = require("../dtos/BrokersDto");
const EditBrokerDto_1 = require("../dtos/EditBrokerDto");
const SetTakePartDto_1 = require("../dtos/SetTakePartDto");
const UpdateStocksDto_1 = require("../dtos/UpdateStocksDto");
let isEmulating = false;
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getAllBrokers() {
        console.log("GETTING BROKERS");
        return JSON.stringify(brokers);
    }
    getBrokerById(params) {
        for (let i of brokers) {
            if (i.broker_id == params.id) {
                return JSON.stringify(i);
            }
        }
    }
    getAllStock() {
        console.log("GETTING STOCK");
        return JSON.stringify(stock);
    }
    testSocket(body) {
        isEmulating = true;
        console.log("TESTING");
        this.appService.emulateExchange(body.emulatingStocks.stock, body.startingDate, body.startingSpeed, brokers);
    }
    stopEmulating() {
        isEmulating = false;
        console.log("STOP EMULATING");
        this.appService.stopExchange();
    }
    addBroker(body) {
        brokers.push({ broker_id: brokers.at(-1).broker_id + 1, name: body.name, money: body.money, take_part: false, stocks: [] });
        console.log(brokers);
    }
    editBroker(body) {
        console.log("BODY ID " + body.broker_id);
        console.log(body.name, body.money);
        for (let v of brokers) {
            console.log(v.broker_id);
            if (v.broker_id == body.broker_id) {
                console.log(v.broker_id);
                v.name = body.name;
                v.money = body.money;
            }
        }
    }
    setTakePart(body) {
        console.log(body.broker_id);
        for (let v of brokers) {
            if (v.broker_id == body.broker_id) {
                v.take_part = body.take_part;
            }
        }
    }
    deleteBroker(body) {
        for (let v in brokers) {
            if (brokers[v].broker_id == body.broker_id) {
                console.log(v);
                brokers.splice(Number(v), 1);
            }
        }
    }
    getBrokersTakesPart() {
        let tmp = [];
        for (let broker of brokers) {
            if (broker.take_part) {
                tmp.push(broker);
            }
        }
        return JSON.stringify(tmp);
    }
    getBrokersNotTakesPart() {
        let tmp = [];
        for (let broker of brokers) {
            if (!broker.take_part) {
                tmp.push(broker);
            }
        }
        return JSON.stringify(tmp);
    }
    updateBrokerStock(body) {
        for (let broker of brokers) {
            console.log(body.broker_id);
            if (broker.broker_id == body.broker_id && (broker.money - body.price * body.amount) > 0 && isEmulating) {
                for (let stock of broker.stocks) {
                    if (stock.name == body.stock) {
                        stock.amount += body.amount;
                        broker.money -= Number(body.price * body.amount);
                        stock.profit = Number(body.price);
                        stock.profit -= Number(body.price * body.amount);
                        console.log(broker.stocks);
                        return;
                    }
                }
                console.log("BUYING");
                broker.stocks.push({ name: body.stock, amount: body.amount, profit: -body.price * body.amount });
                broker.money -= body.price * body.amount;
                console.log(broker.stocks);
            }
        }
    }
    sellStock(body) {
        for (let broker of brokers) {
            console.log(body.broker_id);
            if (broker.broker_id == body.broker_id) {
                for (let stock of broker.stocks) {
                    if (stock.name == body.stock && isEmulating && (stock.amount - body.amount) >= 0) {
                        stock.amount -= Number(body.amount);
                        broker.money += Number(body.price * body.amount);
                        stock.profit += Number(body.price * body.amount);
                        console.log(broker.stocks);
                        return;
                    }
                }
            }
        }
    }
};
__decorate([
    (0, common_1.Get)("/getAllBrokers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getAllBrokers", null);
__decorate([
    (0, common_1.Get)("/getbrokerbyid"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], AppController.prototype, "getBrokerById", null);
__decorate([
    (0, common_1.Get)("/getAllStock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getAllStock", null);
__decorate([
    (0, common_1.Post)("/test"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EmulateDto_1.EmulateDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "testSocket", null);
__decorate([
    (0, common_1.Post)("/stopemulating"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "stopEmulating", null);
__decorate([
    (0, common_1.Post)("/addbroker"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BrokersDto_1.BrokersDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addBroker", null);
__decorate([
    (0, common_1.Post)("/editbroker"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBrokerDto_1.EditBrokerDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "editBroker", null);
__decorate([
    (0, common_1.Post)("/setbrokertakepart"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SetTakePartDto_1.SetTakePartDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "setTakePart", null);
__decorate([
    (0, common_1.Post)("/deletebroker"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBrokerDto_1.EditBrokerDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteBroker", null);
__decorate([
    (0, common_1.Get)("/getbrokerstakepart"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getBrokersTakesPart", null);
__decorate([
    (0, common_1.Get)("/getbrokersnottakepart"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getBrokersNotTakesPart", null);
__decorate([
    (0, common_1.Post)("/buystock"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateStocksDto_1.UpdateStocksDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateBrokerStock", null);
__decorate([
    (0, common_1.Post)("/sellstock"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateStocksDto_1.UpdateStocksDto]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sellStock", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map