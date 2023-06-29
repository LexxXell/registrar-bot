import { PersonRegistrationResult } from '../registrar';
import { Person } from '../registrar/@types/person.type';

export type RegisteredPerson = Person & PersonRegistrationResult;
