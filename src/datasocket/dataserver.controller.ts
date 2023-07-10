import { Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { WorkSpace, WorkSpaceDocument } from 'src/models/workspaces.model';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

@Controller('data-updates')
export class DataUpdatesController {
    private logger = new Logger('DataUpdatesController');

    constructor(
        private readonly databaseService: WorkspacesService,
        @Inject('SOCKET_SERVER') private readonly server: { instance: Server },
        @InjectModel(WorkSpace.name)
        private workspaceModel: Model<WorkSpaceDocument>,
    ) { }

    @Get('/:userId')
    async getUpdatedData(@Param('userId') currentUserId: string) {
        try {
            const dataBaseChangeStream = this.workspaceModel.watch();

            dataBaseChangeStream.on('change', async () => {
                const updatedData = await this.databaseService.FindAllWorkSpaces(
                    currentUserId,
                );

                this.server.instance.emit('currentDataUpdated', updatedData);

                return { message: 'Data updated and sent to client' };
            });

            dataBaseChangeStream.on('error', (error) => {
                this.logger.error('Change stream error:', error);
            });
        } catch (error) {
            this.logger.error('Error updating and sending data', error);
            throw error;
        }
    }
}
