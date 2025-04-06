require('dotenv').config();

module.exports = async (req, res) => {
  const fileId = req.query.file_id;
  if (!fileId) return res.status(400).send("Missing file_id.");

  const tgUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileId}`;
  return res.redirect(302, tgUrl);
};
