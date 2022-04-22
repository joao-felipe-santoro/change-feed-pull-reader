import { Container, CosmosClient, Database } from '@azure/cosmos';

import { v4 as uuidv4 } from 'uuid';

export class Helper {
  static getDatabase(): Database {
    const client: CosmosClient = new CosmosClient({
      endpoint: process.env.AZ_COSMOS_ENDPOINT,
      key: process.env.AZ_COSMOS_KEY,
    });
    const database: Database = client.database(process.env.AZ_COSMOS_DB_ID);
    return database;
  }
  static getConteiner(): Container {
    const container: Container = Helper.getDatabase().container(
      process.env.AZ_COSMOS_CONTAINER_ID,
    );
    return container;
  }

  static generateRandomUUID() {
    return uuidv4();
  }
}
