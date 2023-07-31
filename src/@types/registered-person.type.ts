import { PersonRegistrationResult } from '../registrar/@types';
import { Person } from '../registrar/@types/person.type';

export type RegisteredPerson = Person & PersonRegistrationResult;
