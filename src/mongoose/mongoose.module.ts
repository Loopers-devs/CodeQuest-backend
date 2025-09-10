import { Global, Module } from '@nestjs/common';
import { MongooseModule as Mongoose } from '@nestjs/mongoose';
import { envs } from 'src/config/envs.config';
import { User, UserSchema } from './schemas';

@Global()
@Module({
  imports: [
    Mongoose.forRoot(envs.mongooseUrl),
    Mongoose.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
  ],
  exports: [Mongoose],
})
export class MongooseModule {}
