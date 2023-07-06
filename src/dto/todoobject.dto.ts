
export interface IPriority {
    value: string;
    color: string;
}

export class ToDoDataDTO {
    userId: string;
    taskId: string;
    status: string;
    priority: IPriority;
    description: string;
    info: string;
    title: string;
    createdDate: Date
}

