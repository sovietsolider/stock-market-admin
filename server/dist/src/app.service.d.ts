import { ExchangeGateway } from "./app.gateway";
export declare class AppService {
    private readonly exchangeGateway;
    constructor(exchangeGateway: ExchangeGateway);
    curDateIndex: number;
    currentPrices: {};
    reverseHistories: () => void;
    getDates: () => any[];
    updateDate: () => void;
    getIndexByDate: (date: any) => number;
    updatePrices: (stockToEmulate: any) => void;
    timer: any;
    socket: any;
    getHello(): string;
    emulateExchange(stockToEmulate: any, date: any, speed: any, allbrokers: any): void;
    stopExchange(): void;
}
