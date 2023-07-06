import { ToDoDataDTO } from "./todoobject.dto";
import { SpreadDataDTO } from "./spread.dto";

export class WorkSpaceDTO {
    name: string;
    prefix?: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData?: ToDoDataDTO[];
    spreadSheetData?: SpreadDataDTO[];
}