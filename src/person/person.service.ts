import { Container, SqlQuerySpec } from '@azure/cosmos';

import { CreatePersonDto } from './dto/create-person.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Helper } from '../utils/helper';
import { Injectable } from '@nestjs/common';
import { Person } from './entities/person.entity';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  private container: Container = null;

  constructor(private eventEmitter: EventEmitter2) {
    this.container = Helper.getConteiner();
  }

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const response = await this.container.items.create(
      new Person(createPersonDto.name, createPersonDto.age),
    );
    this.eventEmitter.emitAsync('change-feed-listen', response.resource.id);
    return response.resource;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto): Promise<Person> {
    this.eventEmitter.emitAsync('change-feed-listen', id);
    const response = await this.container.items.upsert<Person>(
      new Person(updatePersonDto.name, updatePersonDto.age, id),
    );

    return response.resource;
  }

  async get(id: string): Promise<Person> {
    const querySpec: SqlQuerySpec = {
      query: 'SELECT * FROM Persons p WHERE p.id = @id',
      parameters: [{ name: '@id', value: id }],
    };
    const { resources: items } = await this.container.items
      .query<Person>(querySpec)
      .fetchAll();

    return items[0];
  }
}
