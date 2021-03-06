import { InMemoryDbService } from 'angular-in-memory-web-api';
export class ApiMockDataService implements InMemoryDbService {
  createDb() {
    let users = [
      {id: 1, username: 'ishotfirst', first_name: 'Han', last_name: 'Solo' },
      {id: 2, username: 'itsatrap', first_name: 'Admiral', last_name: 'Akbar' },
      {id: 3, username: 'nerfherder', first_name: 'Leia', last_name: 'Organa' },
      {id: 4, username: 'whiner', first_name: 'Luke', last_name: 'Skywalker' },
      {id: 5, username: 'trusttheforce', first_name: 'Obi-wan', last_name: 'Kenobi' },
      {id: 6, username: 'shorty', first_name: 'R2', last_name: 'D2' },
      {id: 7, username: 'ishotsecond', first_name: 'Greedo', last_name: null },
      {id: 8, username: 'owmyarm', first_name: 'Wampa', last_name: null },
      {id: 9, username: 'iamyourfather', first_name: 'Darth', last_name: 'Vader' },
      {id: 10, username: 'dontsaymuch', first_name: 'Darth', last_name: 'Maul' },
      {id: 11, username: 'evilgrandpa', first_name: 'Darth', last_name: 'Sidious' },
      {id: 12, username: 'imamistake', first_name: 'Jar Jar', last_name: 'Binks' },
      {id: 13, username: 'rocketeer', first_name: 'Boba', last_name: 'Fett' },
      {id: 14, username: 'hohoho', first_name: 'Jabba', last_name: 'the Hutt' }
    ];
    return {users};
  }
}