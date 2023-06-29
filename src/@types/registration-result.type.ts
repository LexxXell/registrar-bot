import { Person } from '../registrar/@types/person.type';
import { RegisteredPerson } from './registered-person.type';

export type RegistrationResult = {
  registered: RegisteredPerson[];
  nonRegistered: Person[];
};
