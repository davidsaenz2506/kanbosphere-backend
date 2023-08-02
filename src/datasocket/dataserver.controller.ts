import {
    Controller,
    Inject,
    Logger,
    Param,
    Post,
    Body,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { UserLog, UserLogDocument } from 'src/models/userlog.model';
import { WorkSpace, WorkSpaceDocument } from 'src/models/workspaces.model';
import { UsersService } from 'src/users/users.service';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

@Controller('data-updates')
export class DataUpdatesController {
    private logger = new Logger('DataUpdatesController');

    constructor(
        private readonly databaseService: WorkspacesService,
        private readonly usersdatabaseService: UsersService,
        @Inject('SOCKET_SERVER') private readonly server: { instance: Server },
        @InjectModel(WorkSpace.name)
        private workspaceModel: Model<WorkSpaceDocument>,
        @InjectModel(UserLog.name) private usersSpaceModel: Model<UserLogDocument>,
    ) { }

    @Post('/getUpdatedWorkspaceData/:userId')
    async getUpdatedData(
        @Param('userId') currentUserId: string,
        @Body() currentRoomToken: { roomToken: string },
    ) {
        try {
            const workSpaceChangeStream = this.workspaceModel.watch([], {
                fullDocument: 'updateLookup',
            });
            
            workSpaceChangeStream.on('change', async (change) => {
                if (!change?.updateDescription?.updatedFields?.hasOwnProperty("wspDataPreferences")) {
                    this.server.instance
                        .to(currentRoomToken.roomToken)
                        .emit(
                            'currentDataUpdated',
                            await this.databaseService.FindAllWorkSpaces(currentUserId),
                        );

                    return { message: 'Data updated and sent to client' };
                }
            });

            workSpaceChangeStream.on('error', (error) => {
                this.logger.error('Change stream error:', error);
            });
        } catch (error) {
            this.logger.error('Error updating and sending data', error);
            throw error;
        }
    }

    @Post('/getUpdatedUserData/:userId')
    async getUpdatedUserData(
        @Param('userId') currentUserId: string,
        @Body() currentRoomToken: { roomToken: string },
    ) {
        try {
            const usersCollectionStream = this.usersSpaceModel.watch(
                [
                    {
                        $match: { 'fullDocument.userID': currentUserId },
                    },
                ],
                {
                    fullDocument: 'updateLookup',
                },
            );

            usersCollectionStream.on('change', async (change) => {
                const updatedUserData = await this.usersSpaceModel.findOne({
                    userID: currentUserId,
                });

                const friendsData = updatedUserData.friends.map(
                    (currentItem: any) => currentItem.canonicalId,
                );
                const requestData = updatedUserData.requests.map(
                    (currentItem: any) => currentItem.canonicalId,
                );

                const dataShake1 = await this.usersdatabaseService.FindLotOfUsers(
                    friendsData,
                );
                const dataShake2 = await this.usersdatabaseService.FindLotOfUsers(
                    requestData,
                );

                if (updatedUserData)
                    this.server.instance
                        .to(currentRoomToken.roomToken)
                        .emit('currentUserUpdated', [
                            updatedUserData,
                            { friends: dataShake1, requests: dataShake2 },
                        ]);
                return { message: 'Data updated and sent to client' };
            });

            usersCollectionStream.on('error', (error) => {
                this.logger.error('Change stream error:', error);
            });
        } catch (error) {
            this.logger.error('Error updating and sending data', error);
            throw error;
        }
    }
}
