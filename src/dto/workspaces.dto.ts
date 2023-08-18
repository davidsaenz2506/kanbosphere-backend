import { ToDoDataDTO } from "./todoobject.dto";
import { SpreadDataDTO } from "./spread.dto";

export interface IAgilePreferences {
    prefix: string;
    selectedTask: string | null
}

export interface ISpreadSheetPreferences {
    isAutoSaveOpen: boolean;
    isDarkModeOpen: boolean;
    isMultipleSelectionOpen: boolean;
    freezedColumns: number;
}

export interface ICollaborators {
    _id?: string;
    name: string;
    role: string;
    containerPreferences: IAgilePreferences | ISpreadSheetPreferences;
}

export interface ISprintsData {
    sprintId: string;
    sprintPurpose: string;
    sprintDescription: string;
    isSprintActive: boolean;
    sprintStartDate: string | null;
    sprintEndDate: string | null;
    linkedStories: string[];
}

export class ContainerDTO {
    sprints?: ISprintsData[];
    wspData?: ToDoDataDTO[];
    spreadSheetData?: SpreadDataDTO;
}

export class WorkSpaceDTO {
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    isGoalsModeActive: boolean;
    container: ContainerDTO;
    collaborators: ICollaborators[];
}
