import { Controller, Get, Param } from '@nestjs/common';
import { Body, Delete, Post, Put, UseGuards } from '@nestjs/common/decorators';
import { WorkSpaceDTO } from 'src/dto/workspaces.dto';
import { WorkspacesService } from './workspaces.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly service: WorkspacesService) { }

  @UseGuards(AuthGuard)
  @Get('/userWorkspaces/:userId')
  FindUserWorkSpaces(@Param('userId') userId: string) {
    return this.service.FindAllWorkSpaces(userId);
  }

  @UseGuards(AuthGuard)
  @Get('/:workspaceId')
  FindOneWorkSpace(@Param('workspaceId') workspaceId: string) {
    return this.service.FindOne(workspaceId);
  }

  @UseGuards(AuthGuard)
  @Post()
  AddWorkSpace(@Body() body: WorkSpaceDTO) {
    return this.service.AddWorkSpace(body);
  }

  @UseGuards(AuthGuard)
  @Post('/:workspaceId')
  UpdateWorkSpace(
    @Param('workspaceId') id: string,
    @Body() body: WorkSpaceDTO,
  ) {
    return this.service.UpdateWorkSpace(id, body);
  }

  @UseGuards(AuthGuard)
  @Post('/delete/:workspaceId')
  DeleteWorkSpace(@Param('workspaceId') id: string) {
    return this.service.DeleteWorkSpace(id);
  }
}
