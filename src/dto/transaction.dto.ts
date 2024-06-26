import { ITransactionData } from "src/datasocket/socket.gateway";
import { ISprintsData, WorkSpaceDTO } from "./workspaces.dto";
import { ToDoDataDTO } from "./todoobject.dto";

export class TransactionDTO {
    body: WorkSpaceDTO;
    transactionObject: ITransactionData
}

export class TransactionCardDTO {
    body: Partial<ToDoDataDTO>;
    transactionObject: ITransactionData
}

export class TransactionSprintDTO {
    body: Partial<ISprintsData>;
    transactionObject: ITransactionData
}