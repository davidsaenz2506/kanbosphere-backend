import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [ ConfigModule.forRoot(), MongooseModule.forRoot("mongodb+srv://David:12345@cluster0.z0kfntn.mongodb.net/tumble_dev?retryWrites=true&w=majority"), WorkspacesModule]
})

export class AppModule {}
