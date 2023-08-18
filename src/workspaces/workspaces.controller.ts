import { Controller, Get, Param, Inject } from '@nestjs/common';
import { Body, Post, Query, UseGuards } from '@nestjs/common/decorators';
import { WorkSpaceDTO } from 'src/dto/workspaces.dto';
import { WorkspacesService } from './workspaces.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Server } from 'socket.io';
import { ObjectId } from 'mongoose';
import { SocketGateway } from 'src/datasocket/socket.gateway';
import { TransactionCardDTO, TransactionDTO, TransactionSprintDTO } from 'src/dto/transaction.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly service: WorkspacesService,
    @Inject(SocketGateway) private readonly socketGateway: SocketGateway,
  ) { }

  @UseGuards(AuthGuard)
  @Get('/userWorkspaces/:userId')
  async FindUserWorkSpaces(@Param('userId') userId: ObjectId) {
    return this.service.FindAllWorkSpaces(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:workspaceId')
  async FindOneWorkSpace(@Param('workspaceId') workspaceId: string, @Query('socketId') socketId: string, @Query('userId') userId: string) {
    await this.socketGateway.LeaveAllWorkspacesRoom(socketId, userId);
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
    @Body() body: TransactionDTO,
  ) {
    await this.service.UpdateWorkspace(id, body.body);
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/addSprint/:workspaceId')
  async AddSprint(@Param('workspaceId') id: string, @Body() body: TransactionSprintDTO) {
    await this.service.UpdateSprintData(id, body.body, "add");
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/updateSprint/:workspaceId')
  async UpdateSprint(@Param('workspaceId') id: string, @Body() body: TransactionSprintDTO) {
    await this.service.UpdateSprintData(id, body.body, "update");
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/deleteSprint/:workspaceId')
  async DeleteSprint(@Param('workspaceId') id: string, @Body() body: TransactionSprintDTO) {
    await this.service.UpdateSprintData(id, body.body, "delete");
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/addCard/:workspaceId')
  async AddCard(@Param('workspaceId') id: string, @Body() body: TransactionCardDTO) {
    await this.service.UpdateDataMatrix(id, body.body, "add");
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/deleteCard/:workspaceId')
  async DeleteCard(@Param('workspaceId') id: string, @Body() body: TransactionCardDTO) {
    await this.service.UpdateDataMatrix(id, body.body, "delete");
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/updateCard/:workspaceId')
  async UpdateCard(@Param('workspaceId') id: string, @Body() body: TransactionCardDTO) {
    await this.service.UpdateDataMatrix(id, body.body, "update");
    await this.socketGateway.RoomUpdateManagement(body.transactionObject);
    return
  }

  @UseGuards(AuthGuard)
  @Post('/delete/:workspaceId')
  async DeleteWorkSpace(@Param('workspaceId') id: string) {
    await this.service.DeleteWorkSpace(id);
    return
  }
}
