import * as Joi from 'joi';

import { ChangeFeedListener } from './listeners/change-feed.listener';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PersonModule } from './person/person.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AZ_COSMOS_ENDPOINT: Joi.required(),
        AZ_COSMOS_KEY: Joi.required(),
        AZ_COSMOS_DB_ID: Joi.required(),
        AZ_COSMOS_CONTAINER_ID: Joi.required(),
      }),
    }),
    ScheduleModule.forRoot(),
    PersonModule,
  ],
  providers: [ChangeFeedListener],
})
export class AppModule {}
