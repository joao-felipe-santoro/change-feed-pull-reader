import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { ChangeFeedResponse } from '@azure/cosmos';
import { Helper } from '../utils/helper';
import { Interval } from '@nestjs/schedule';
import { Person } from '../person/entities/person.entity';

@Injectable()
export class ReaderService {
  private readonly logger = new Logger(ReaderService.name);

  @Interval(10000)
  async poll() {
    const container = Helper.getConteiner();
    const feed = container.items.changeFeed('/id', {
      startFromBeginning: true,
    });
    while (feed.hasMoreResults) {
      const response: ChangeFeedResponse<Person[]> = await feed.fetchNext();
      if (response.statusCode === HttpStatus.NOT_MODIFIED) {
        console.log('NO CHANGE ');
        break;
      } else
        response.result.forEach((person) => {
          console.log(`Change detected in Person #${person.id}`);
          console.log(person);
        });
    }
  }
}
