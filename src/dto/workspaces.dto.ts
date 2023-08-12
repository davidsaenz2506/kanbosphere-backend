import { ToDoDataDTO } from "./todoobject.dto";
import { SpreadDataDTO } from "./spread.dto";

export interface IAgilePreferences {
    prefix: string;
    selectedTask: string | null
}

export interface ISpreadSheetPreferences {
    isDarkModeOpen: boolean;
    isMultipleSelectionOpen: boolean;
    freezedColumns: number;
}

export interface ICollaborators {
    _id?: string;
    name: string;
    role: string;
}

export class ContainerDTO {
    containerPreferences: IAgilePreferences | ISpreadSheetPreferences;
    wspData?: ToDoDataDTO[];
    spreadSheetData?: SpreadDataDTO;
}

export class WorkSpaceDTO {
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    container: ContainerDTO;
    collaborators: ICollaborators[];
}
