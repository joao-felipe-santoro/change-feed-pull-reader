import { Helper } from '../../utils/helper';

export class Person {
  id: string;
  name: string;
  age: number;

  constructor(name: string, age: number, id?: string) {
    this.id = id ?? Helper.generateRandomUUID();
    this.name = name;
    this.age = age;
  }
}
