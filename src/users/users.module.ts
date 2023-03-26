import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose"
import { UserLog, UserLogSchema } from 'src/models/userlog.model';
import { UsersService } from './users.service';


@Module({
    imports: [MongooseModule.forFeature([{ name: UserLog.name, schema: UserLogSchema, collection: "users" }])],
    providers: [UsersService],
    exports: [UsersService]
})

export class UsersModule {}
