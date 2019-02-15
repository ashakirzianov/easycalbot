import { Telegraf, Composer } from 'telegraf';
import { execute } from './bot';

const reply = Composer.reply;

const testToken = '';
const bot = new Telegraf(process.env.BOT_TOKEN || testToken);

const welcome = `
Welcome to easy to use calendar.
Just tell me about your plans, for example:
Apr 23, 2019 --  My Dad's birthday
`;
bot.start(reply(welcome));
bot.on('text', ctx => {
    const text = ctx.message && ctx.message.text;
    if (text && ctx.from) {
        const replyText = execute(text, ctx.from.id);
        ctx.reply(replyText);
    }
});

(bot as any).launch(); // TODO: why no 'launch' in bot type ?
