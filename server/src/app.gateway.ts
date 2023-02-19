import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway()
export class ExchangeGateway {
    constructor() {}
    @WebSocketServer()
    server;
}