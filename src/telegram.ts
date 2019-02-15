import { Telegraf, Composer } from 'telegraf';

const reply = Composer.reply;

const testToken = '';
const bot = new Telegraf(process.env.BOT_TOKEN || testToken);

const welcome = `
Welcome to easy to use calendar.
Just tell me about your plans, for example:
Apr 23, 2019 --  My Dad's birthday
`;
bot.start(reply(welcome));

(bot as any).launch(); // TODO: why no 'launch' in bot type ?
