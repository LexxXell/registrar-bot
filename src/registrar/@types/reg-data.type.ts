import { FormularTypes } from './enum/tip-formular.enum.js';
import { Person } from './person.type.js';

export type RegData = Person & {
  tip_formular: FormularTypes;
  date: string;
};
