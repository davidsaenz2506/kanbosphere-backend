import { IUser } from "src/users/users.service";

export interface IPriority {
    value: string;
    color: string;
}

export interface IFilePath {
    name: string;
    relativePath: string
}

export interface IClockTime {
    recordedTime: number;
    recordedBy: Partial<IUser>;
    registrationDate: Date;
}

export class ToDoDataDTO {
    userId: string;
    taskId: string;
    status: string;
    type: string;
    priority: IPriority;
    description: string;
    info: string;
    title: string;
    createdDate: Date;
    expectedWorkingHours: number;
    clockTime: IClockTime[];
    file: IFilePath[];
}

