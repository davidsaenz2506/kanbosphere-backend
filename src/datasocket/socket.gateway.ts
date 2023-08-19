import {
    Logger, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Model, ObjectId } from 'mongoose';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import { UserLog, UserLogDocument } from 'src/models/userlog.model';
import { SocketIdService } from 'src/sockets/socketid.service';
import { UsersService } from 'src/users/users.service';
import { WorkspacesService } from 'src/workspaces/workspaces.service';

export interface ITransactionData {
    currentUserSocketId: string,
    currentRoomToken: {
        roomToken: string | ObjectId
    }
}

export interface ISocialTransactionData {
    currentReceiverId: string | ObjectId,
    currentTransmitterId: string | ObjectId
}

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger('WebSocketGateway');
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly workspacesService: WorkspacesService,
        private readonly usersService: UsersService,
        @InjectModel(UserLog.name) private usersSpaceModel: Model<UserLogDocument>,
    ) { }

    handleConnection(client: Socket) {
        this.logger.log(`Cliente conectado: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Cliente desconectado: ${client.id}`);
    }

    setSockerServer(sockerServer: Server) {
        this.server = sockerServer;
    }

    async LeaveAllWorkspacesRoom(currentSocketId: string, userId: string) {
        const currentSocket = this.server.sockets.sockets.get(currentSocketId);

        if (currentSocket?.rooms) {
            Array.from(currentSocket?.rooms).forEach((currentSocketBlock) => {
               if (currentSocketBlock !== userId) currentSocket.leave(currentSocketBlock)
            })
        }       
    }

    async RoomUpdateManagement(transactionInformation: ITransactionData) {
        try {
            const uniqueSocketToken: string = transactionInformation.currentUserSocketId;

            const currentDataUpdated = await this.workspacesService.FindOne(transactionInformation.currentRoomToken.roomToken.toString());
            this.server.to(transactionInformation.currentRoomToken.roomToken.toString()).except(uniqueSocketToken).emit("currentDataUpdated", [currentDataUpdated, transactionInformation.currentUserSocketId]);
            return { message: 'Data updated and sent to client' };

        } catch (error) {
            this.logger.error('Error updating and sending data', error);
            throw error;
        }
    }

    async UserUpdateManagement(transactionInformation: ISocialTransactionData) {
        try {
            const updatedReceiverData = await this.usersSpaceModel.findOne({ _id: transactionInformation.currentReceiverId });
            const updatedTransmitterData = await this.usersSpaceModel.findOne({ _id: transactionInformation.currentTransmitterId });

            if (updatedReceiverData && updatedTransmitterData) {
                const friendsReceiverData = updatedReceiverData.friends.map((currentItem: any) => currentItem.canonicalId);
                const requestReceiverData = updatedReceiverData.requests.map((currentItem: any) => currentItem.canonicalId);

                const friendsTransmitterData = updatedTransmitterData.friends.map((currentItem: any) => currentItem.canonicalId);
                const requestTransmitterData = updatedTransmitterData.requests.map((currentItem: any) => currentItem.canonicalId);

                const dataShake1Receiver = await this.usersService.FindLotOfUsers(friendsReceiverData);
                const dataShake2Receiver = await this.usersService.FindLotOfUsers(requestReceiverData);

                const dataShake1Transmitter = await this.usersService.FindLotOfUsers(friendsTransmitterData);
                const dataShake2Transmitter = await this.usersService.FindLotOfUsers(requestTransmitterData);


                this.server.to(transactionInformation.currentReceiverId.toString()).emit('currentUserUpdated', [updatedReceiverData, {
                    friends: dataShake1Receiver, requests: dataShake2Receiver
                }]);

                this.server.to(transactionInformation.currentTransmitterId.toString()).emit('currentUserUpdated', [updatedTransmitterData, {
                    friends: dataShake1Transmitter, requests: dataShake2Transmitter
                }]);
            }

            return { message: 'Data updated and sent to client' };

        } catch (error) {
            this.logger.error('Error updating and sending data', error);
            throw error;
        }
    }

    async WorkspacesUpdateManagement(transactionInformation: ISocialTransactionData) {
        try {
            const updatedWorkspaces = await this.workspacesService.FindAllWorkSpaces(transactionInformation.currentReceiverId);

            if (updatedWorkspaces) {
                this.server.to(transactionInformation.currentReceiverId.toString()).emit('userWorkspacesUpdated', updatedWorkspaces);
            }

            return { message: 'Data updated and sent to client' };
        } catch (error) {
            this.logger.error('Error updating and sending data', error);
            throw error;
        }
    }
}
