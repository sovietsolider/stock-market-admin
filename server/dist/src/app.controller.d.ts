import { AppService } from './app.service';
import { EmulateDto } from "../dtos/EmulateDto";
import { BrokersDto } from "../dtos/BrokersDto";
import { EditBrokerDto } from "../dtos/EditBrokerDto";
import { SetTakePartDto } from "../dtos/SetTakePartDto";
import { UpdateStocksDto } from "../dtos/UpdateStocksDto";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getAllBrokers(): string;
    getBrokerById(params: any): string;
    getAllStock(): string;
    testSocket(body: EmulateDto): void;
    stopEmulating(): void;
    addBroker(body: BrokersDto): void;
    editBroker(body: EditBrokerDto): void;
    setTakePart(body: SetTakePartDto): void;
    deleteBroker(body: EditBrokerDto): void;
    getBrokersTakesPart(): string;
    getBrokersNotTakesPart(): string;
    updateBrokerStock(body: UpdateStocksDto): void;
    sellStock(body: UpdateStocksDto): void;
}
