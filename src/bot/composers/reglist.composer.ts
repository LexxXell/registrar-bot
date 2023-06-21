import path from 'path';
import axios from 'axios';
import { Composer } from 'telegraf';
import { createWriteStream, existsSync, unlink } from 'node:fs';

import { Context } from '../@types';
import { Logger } from '../../helpers/logger.helper';
import { errorToUser } from '../helpers/error-to-user.helper';

const logger = new Logger('RegList Composer');

export const reglistComposer: Composer<Context> = new Composer();

reglistComposer.on('message', async (ctx: Context, next) => {
  if (!/\/?newreglist/i.test(ctx.message?.caption)) {
    return next();
  }
  if (ctx.message.document) {
    if (ctx.message.document.file_name.slice(-5) !== '.xlsx') {
      await ctx.replyWithHTML(ctx.i18n.t('no_xlsx_document'));
    }
    const fileId = ctx.message.document.file_id;
    try {
      const fileInfo = await ctx.telegram.getFile(fileId);

      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInfo.file_path}`;

      const response = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream',
      });

      const filePath = path.resolve('storage/reglist.xlsx');

      if (existsSync(filePath)) {
        await ctx.replyWithDocument({ source: filePath }, { caption: ctx.i18n.t('reg_list_was_exist__upload') });
      }
      response.data.pipe(createWriteStream(filePath));

      response.data.on('end', async () => {
        await ctx.replyWithHTML(ctx.i18n.t('reg_list_upload_success'));
      });
    } catch (error) {
      logger.error('Error downloading the file:', error);
      await errorToUser(ctx);
    }
  } else await ctx.replyWithHTML(ctx.i18n.t('no_document'));
});

reglistComposer.command('getRegList', async (ctx: Context) => {
  const filePath = path.resolve('storage/reglist.xlsx');
  if (!existsSync(filePath)) {
    return await ctx.replyWithHTML(ctx.i18n.t('storage_is_empty'));
  }
  await ctx.replyWithDocument({ source: filePath }, { caption: ctx.i18n.t('reg_list_was_exist__get') });
});

reglistComposer.command('removeRegList', async (ctx: Context) => {
  const filePath = path.resolve('storage/reglist.xlsx');

  if (!existsSync(filePath)) {
    await ctx.replyWithHTML(ctx.i18n.t('storage_is_empty'));
  }

  unlink(filePath, async (err) => {
    if (err) {
      return await errorToUser(ctx);
    }
    return await ctx.replyWithHTML(ctx.i18n.t('reg_list_removed_success'));
  });
});
