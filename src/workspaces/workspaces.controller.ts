import { Controller, Get, Param } from '@nestjs/common';
import { Body, Delete, Post, Put, UseGuards } from '@nestjs/common/decorators';
import { WorkSpaceDTO } from 'src/dto/workspaces.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) {}

  @Get('/userWorkspaces/:userId')
  FindUserWorkSpaces(@Param('userId') userId: string) {
    return this.service.FindAllWorkSpaces(userId);
  }

  @Get('/:workspaceId')
  FindOneWorkSpace(@Param('workspaceId') workspaceId: string) {
    return this.service.FindOne(workspaceId);
  }

  @Post()
  AddWorkSpace(@Body() body: WorkSpaceDTO) {
    return this.service.AddWorkSpace(body);
  }

  @Post('/:workspaceId')
  UpdateWorkSpace(
    @Param('workspaceId') id: string,
    @Body() body: WorkSpaceDTO,
  ) {
    return this.service.UpdateWorkSpace(id, body);
  }

  @Post('/delete/:workspaceId')
  DeleteWorkSpace(@Param('workspaceId') id: string) {
    console.log(id);
    return this.service.DeleteWorkSpace(id);
  }
}
