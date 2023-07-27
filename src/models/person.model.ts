import { model, ObjectId, Schema } from 'mongoose';
import { Logger } from '../helpers/logger.helper';
import uuid4 from 'uuid4';
import { dateRegex } from '../helpers/constants.helper';

const logger = new Logger('PersonModel');

export interface IPerson {
  email: string;
  nume: string;
  prenume: string;
  data_nasterii: string;
  locul_nasterii: string;
  prenume_mama: string;
  prenume_tata: string;
  registaretion_date?: string;
  registaretion_number?: string;
  error?: boolean;
}

export interface IPersonModel extends IPerson {}

export const PersonSchema = new Schema<IPersonModel>(
  {
    email: { type: 'string', required: false },
    nume: { type: 'string', required: true },
    prenume: { type: 'string', required: true },
    data_nasterii: { type: 'string', required: true },
    locul_nasterii: { type: 'string', required: true },
    prenume_mama: { type: 'string', required: true },
    prenume_tata: { type: 'string', required: true },
    registaretion_date: { type: 'string', required: false, default: null },
    registaretion_number: { type: 'string', required: false, default: null },
    error: { type: 'boolean', default: false },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

PersonSchema.pre('save', async function (next) {
  if (!dateRegex.test(this.data_nasterii)) {
    throw new Error('Wrong data_nasterii format. <yyyy-mm-dd>');
  }
  if (!this.email) {
    this.email = getAutoEmail(this);
  }
  if (await this.$model('Person').findOne({ email: this.email })) {
    this.email = getAutoEmail(this, true);
  }
});

function getAutoEmail(ctx: IPerson | any, useUUID: boolean = /true/.test(process.env.AUTO_EMAIL_UUID)): string {
  const address = useUUID
    ? `${uuid4().replace(/-/g, '')}`
    : `${ctx.nume}${ctx.prenume}${ctx.data_nasterii.replace(/[-,\.]/g, '')}`;
  const domen = process.env.AUTO_EMAIL_DOMEN || 'mail.com';
  return `${address}@${domen}`;
}

export const PersonModel = model<IPersonModel>('Person', PersonSchema);