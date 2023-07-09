import path from 'path';
import axios from 'axios';
import { Composer } from 'telegraf';
import { createWriteStream, existsSync, unlink } from 'node:fs';

import { Context } from '../@types';
import { Logger } from '../../helpers/logger.helper';
import { errorToUser } from '../helpers/error-to-user.helper';
import { reglistPath, templateReglistPath } from '../../helpers/constants.helper';

const logger = new Logger('RegList Composer');

export const reglistComposer: Composer<Context> = new Composer();

reglistComposer.on('message', async (ctx: Context, next) => {
  if (!/\/?newreglist/i.test(ctx.message?.caption)) {
    return next();
  }
  if (ctx.message.document) {
    if (ctx.message.document.file_name.slice(-5) !== reglistPath.slice(-5)) {
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

      const filePath = path.resolve(reglistPath);

      if (existsSync(filePath)) {
        await ctx.replyWithDocument(
          { source: filePath },
          { caption: ctx.i18n.t('reg_list_was_exist__upload'), parse_mode: 'HTML' },
        );
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

reglistComposer.hears(/\/getReglistTemplate/i, async (ctx: Context) => {
  const filePath = path.resolve(templateReglistPath);
  if (!existsSync(filePath)) {
    return await errorToUser(ctx);
  }
  await ctx.replyWithDocument({ source: filePath }, { caption: ctx.i18n.t('get_template'), parse_mode: 'HTML' });
});

reglistComposer.hears(/\/getRegList/i, async (ctx: Context) => {
  const filePath = path.resolve(reglistPath);
  if (!existsSync(filePath)) {
    return await ctx.replyWithHTML(ctx.i18n.t('storage_is_empty'));
  }
  await ctx.replyWithDocument(
    { source: filePath },
    { caption: ctx.i18n.t('reg_list_was_exist__get'), parse_mode: 'HTML' },
  );
});

reglistComposer.hears(/\/removeRegList/i, async (ctx: Context) => {
  const filePath = path.resolve(reglistPath);

  if (!existsSync(filePath)) {
    return await ctx.replyWithHTML(ctx.i18n.t('storage_is_empty'));
  }

  await ctx.replyWithDocument(
    { source: filePath },
    { caption: ctx.i18n.t('reg_list_was_exist__get'), parse_mode: 'HTML' },
  );

  unlink(filePath, async (err) => {
    if (err) {
      return await errorToUser(ctx);
    }
    return await ctx.replyWithHTML(ctx.i18n.t('reg_list_removed_success'));
  });
});
