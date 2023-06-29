import { FormularTypes } from '../quotasChecker/@types';

export const reglistPath: string = 'storage/reglist.xlsx';
export const regCooldown: number = Number(process.env.REG_COOLDOWN_MS) || 3600000; // def. 1 hour
export const formularType: keyof typeof FormularTypes = 'ART8_81__10_27';
