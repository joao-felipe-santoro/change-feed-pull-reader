import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { ChangeFeedResponse } from '@azure/cosmos';
import { Helper } from '../utils/helper';
import { OnEvent } from '@nestjs/event-emitter';
import { Person } from '../person/entities/person.entity';

@Injectable()
export class ChangeFeedListener {
  private readonly logger = new Logger(ChangeFeedListener.name);

  @OnEvent('change-feed-listen')
  async listen(partitionKey: string | number | boolean) {
    this.logger.debug(`Start listening for changes on #${partitionKey}`);
    const container = Helper.getConteiner();
    const feed = container.items.changeFeed<Person>(partitionKey, {
      startFromBeginning: true,
    });
    while (feed.hasMoreResults) {
      const response: ChangeFeedResponse<Person[]> = await feed.fetchNext();
      if (response.statusCode === HttpStatus.NOT_MODIFIED) {
        this.logger.debug(`No change detected on #${partitionKey}`);
      } else {
        this.logger.debug(`Change detected on #${partitionKey}`);
        response.result.forEach((person) => {
          this.logger.debug(person);
        });
        this.logger.debug(`Stop listening for changes on #${partitionKey}`);
        break;
      }
    }
  }
}
