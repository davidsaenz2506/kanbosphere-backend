import { ToDoDataDTO } from "./todoobject.dto";
import { SpreadDataDTO } from "./spread.dto";
import { ObjectId } from "mongoose";

export interface IAgilePreferences {
    selectedTask: string | null
}

export interface ISpreadSheetPreferences {
    isDarkModeOpen: boolean;
    isMultipleSelectionOpen: boolean;
    freezedColumns: number;
}

export class WorkSpaceDTO {
    name: string;
    prefix?: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData?: ToDoDataDTO[];
    wspDataPreferences?: IAgilePreferences | ISpreadSheetPreferences;
    spreadSheetData?: SpreadDataDTO[];
    sharedWith: ObjectId[];
}
