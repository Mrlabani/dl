const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Send a video or document to get a direct download link!"));

bot.on(['video', 'document'], async (ctx) => {
  const file = ctx.message.video || ctx.message.document;
  if (!file) return ctx.reply("Send a valid video or document.");

  const fileId = file.file_id;
  const fileName = file.file_name || "video.mp4";

  try {
    await ctx.telegram.forwardMessage(process.env.LOG_CHANNEL_ID, ctx.chat.id, ctx.message.message_id);
  } catch (err) {
    console.error("Forward failed:", err);
  }

  const link = `${process.env.BASE_URL}/download?file_id=${fileId}`;
  ctx.reply(`✅ File: ${fileName}\n📥 Download: ${link}`);
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (err) {
      console.error("Webhook Error:", err);
      res.status(500).send("Error");
    }
  } else {
    res.status(200).send("Bot running!");
  }
};
