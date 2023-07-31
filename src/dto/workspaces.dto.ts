import { ToDoDataDTO } from "./todoobject.dto";
import { SpreadDataDTO } from "./spread.dto";
import { ObjectId } from "mongoose";

export interface IWspPreferences {
    selectedTask: string
}

export class WorkSpaceDTO {
    name: string;
    prefix?: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData?: ToDoDataDTO[];
    spreadSheetData?: SpreadDataDTO[];
    wspDataPreferences?: IWspPreferences;
    sharedWith: ObjectId[];
}
