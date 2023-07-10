import { Controller, Get, Param, Inject } from '@nestjs/common';
import { Body, Delete, Post, Put, UseGuards } from '@nestjs/common/decorators';
import { WorkSpaceDTO } from 'src/dto/workspaces.dto';
import { WorkspacesService } from './workspaces.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Server } from 'socket.io';
import { ToDoDataDTO } from 'src/dto/todoobject.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly service: WorkspacesService,
    @Inject('SOCKET_SERVER') private readonly server: { instance: Server },
  ) { }

  @UseGuards(AuthGuard)
  @Get('/userWorkspaces/:userId')
  async FindUserWorkSpaces(@Param('userId') userId: string) {
    return this.service.FindAllWorkSpaces(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:workspaceId')
  async FindOneWorkSpace(@Param('workspaceId') workspaceId: string) {
    return this.service.FindOne(workspaceId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async AddWorkSpace(@Body() body: WorkSpaceDTO) {
    const createdWorkspaces = await this.service.AddWorkSpace(body);
    return createdWorkspaces;
  }

  @UseGuards(AuthGuard)
  @Post('/:workspaceId')
  async UpdateWorkSpace(
    @Param('workspaceId') id: string,
    @Body() body: WorkSpaceDTO,
  ) {
    const updatedWorkspace = await this.service.UpdateWorkspace(id, body);
    return updatedWorkspace;
  }

  @UseGuards(AuthGuard)
  @Post('/addCard/:workspaceId')
  async AddCard(@Param('workspaceId') id: string, @Body() body: Partial<ToDoDataDTO>) {
    const updatedWorkspace = await this.service.UpdateDataMatrix(id, body, "add");
    return updatedWorkspace;
  }

  @UseGuards(AuthGuard)
  @Post('/deleteCard/:workspaceId')
  async DeleteCard(@Param('workspaceId') id: string, @Body() body: Partial<ToDoDataDTO>) {
    const updatedWorkspace = await this.service.UpdateDataMatrix(id, body, "delete");
    return updatedWorkspace;
  }

  @UseGuards(AuthGuard)
  @Post('/updateCard/:workspaceId')
  async UpdateCard(@Param('workspaceId') id: string, @Body() body: Partial<ToDoDataDTO>) {
    const updatedWorkspace = await this.service.UpdateDataMatrix(id, body, "update");
    return updatedWorkspace;
  }

  @UseGuards(AuthGuard)
  @Post('/delete/:workspaceId')
  async DeleteWorkSpace(@Param('workspaceId') id: string) {
    const deletedWorkspaces = await this.service.DeleteWorkSpace(id);

    return deletedWorkspaces;
  }
}
