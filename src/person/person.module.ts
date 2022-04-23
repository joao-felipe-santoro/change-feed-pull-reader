import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
