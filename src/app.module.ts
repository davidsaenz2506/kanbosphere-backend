import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [ ConfigModule.forRoot(), MongooseModule.forRoot("mongodb://127.0.0.1:27017/tumble_dev"), WorkspacesModule]
})
export class AppModule {}
