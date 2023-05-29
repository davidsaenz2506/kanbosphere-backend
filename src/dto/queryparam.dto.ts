import { ObjectId } from "mongoose";

export class QueryParamsDTO {
    workspaceID: ObjectId;
    query: string;
}

