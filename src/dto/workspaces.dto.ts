import { ToDoDataDTO } from "./todoobject.dto";

export class WorkSpaceDTO {
    name: string;
    createdDate: Date;
    createdById: string;
    type: string;
    wspData: ToDoDataDTO[]
}