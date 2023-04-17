import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  UpdateWorkSpace(id: string, body: WorkSpaceDTO) {
    return this.workspaceModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true },
    );
  }

  DeleteWorkSpace(id: string) {
    console.log(id);
    return this.workspaceModel.findByIdAndDelete(id);
  }
}
