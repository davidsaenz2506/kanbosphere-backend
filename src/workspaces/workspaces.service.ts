import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ToDoDataDTO } from 'src/dto/todoobject.dto';
import { ISprintsData, WorkSpaceDTO } from 'src/dto/workspaces.dto';
import { WorkSpace, WorkSpaceDocument } from 'src/models/workspaces.model';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(WorkSpace.name)
    private workspaceModel: Model<WorkSpaceDocument>,
  ) { }

  FindAllWorkSpaces(userId: ObjectId | string) {
    return this.workspaceModel.find({
      'collaborators._id': userId,
    }, { container: 0 });
  }

  FindOne(userId: string) {
    return this.workspaceModel.findOne({ _id: userId });
  }

  AddWorkSpace(body: WorkSpaceDTO) {
    return this.workspaceModel.create(body);
  }

  AddUserToWorkspaceGateway(guestId: string, workspaceId: string, step: string) {
    const userToAdd: string = guestId;
    const workspaceIdServer: string = workspaceId;

    const updatedWorkspace = this.workspaceModel.findByIdAndUpdate(
      workspaceIdServer,
      {
        $push: {
          collaborators: userToAdd,
        },
      },
    );

    return updatedWorkspace;
  }

  async UpdateDataMatrix(
    id: string,
    body: Partial<ToDoDataDTO>,
    method: string,
  ) {
    console.log(body)
    switch (method) {
      case 'add':
        return this.workspaceModel.updateOne(
          { _id: id },
          {
            $push: {
              "container.wspData": body,
            },
          },
        );
      case 'delete':
        return this.workspaceModel.updateOne(
          { _id: id },
          {
            $pull: {
              "container.wspData": {
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
              "container.wspData": {
                taskId: body.taskId,
              },
            },
          },
        );

        await this.workspaceModel.updateOne(
          { _id: id },
          {
            $push: {
              "container.wspData": body,
            },
          },
        );
    }
  }

  async UpdateSprintData(
    id: string,
    body: Partial<ISprintsData>,
    method: string,
  ) {
    switch (method) {
      case 'add':
        return this.workspaceModel.updateOne(
          { _id: id },
          {
            $push: {
              "container.sprints": body,
            },
          },
        );
      case 'delete':
        return this.workspaceModel.updateOne(
          { _id: id },
          {
            $pull: {
              "container.sprints": {
                sprintId: body.sprintId,
              },
            },
          },
        );
      case 'update':
        await this.workspaceModel.updateOne(
          { _id: id },
          {
            $pull: {
              "container.sprints": {
                 sprintId: body.sprintId,
              },
            },
          },
        );

        await this.workspaceModel.updateOne(
          { _id: id },
          {
            $push: {
              "container.sprints": body,
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
