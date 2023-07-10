import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToDoDataDTO } from 'src/dto/todoobject.dto';
import { WorkSpaceDTO } from 'src/dto/workspaces.dto';
import { WorkSpace, WorkSpaceDocument } from 'src/models/workspaces.model';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(WorkSpace.name)
    private workspaceModel: Model<WorkSpaceDocument>,
  ) {}

  FindAllWorkSpaces(userId: string) {
    return this.workspaceModel.find({
      createdById: userId,
    });
  }

  FindOne(userId: string) {
    return this.workspaceModel.findOne({ _id: userId });
  }

  AddWorkSpace(body: WorkSpaceDTO) {
    return this.workspaceModel.create(body);
  }

  async UpdateDataMatrix(id: string, body: Partial<ToDoDataDTO>, method: string) {
    switch (method) {
      case 'add':
        return this.workspaceModel.updateOne(
          { _id: id },
          {
            $push: {
              wspData: body,
            },
          },
        );
      case 'delete':
        return this.workspaceModel.updateOne(
          { _id: id },
          {
            $pull: {
              wspData: {
                taskId: body.taskId,
              },
            },
          },
        );
      case 'update':
        await this.workspaceModel.updateOne(
          { _id: id },
          {
            $pull: {
              wspData: {
                taskId: body.taskId,
              },
            },
          },
        );

        await this.workspaceModel.updateOne(
          { _id: id },
          {
            $push: {
              wspData: body,
            },
          },
        );
    }
  }

  UpdateWorkspace(id: string, body: WorkSpaceDTO) {
    return this.workspaceModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  DeleteWorkSpace(id: string) {
    return this.workspaceModel.findByIdAndDelete(id);
  }
}
