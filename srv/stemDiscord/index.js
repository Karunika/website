// wrapper class

const { STEM_DISCORD_DB:DB, STEM_DISCORD_DB_DOCUMENT } = process.env;
const mongoose = require(`mongoose`);
const express = require(`express`);

if (DB) {
  const { userInfoPublicSchema } = require(`${__dirname}/db`);
  // TODO: write on markdown about this STEM_DISCORD_DB_DOCUMENT
  const conn = 
  mongoose.
    createConnection(
      `${DB}/${STEM_DISCORD_DB_DOCUMENT ?? `information`}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });

  const userInfoPublic = 
      conn.model(
        `userInfo`,
        userInfoPublicSchema,
        `userinfos`);
  //    explicitly use pluralized lowercase version

  const expressApi = (() => {
    const app = express();
    app.use(express.json());

    app.get(`/`, (req, res) => {
      res.json({ message: `OK` });
    });

    app.get(`/user`, async (req, res) => {
      const { server, user_id } = req.params;
      if (!server) 
        return res.status(400).json({ message: `no server id provided`});
      if (!user_id) 
        return res.status(400).json({ message: `no user id provided` });
      // TODO: add authentication module
      // if auth is true, use the userInfo model not the public one
      const q = await userInfoPublic.findOne({ server, user_id }).lean();
      if (q === null) 
        return res.status(404).json({message:`user is not found`});
      res.json(q);
    });
  })();


  module.exports = {
    models: {
      userInfoPublic,
    },
    expressApi,
  };
} else {
  console.log(`no db uri for stem discord was found. disabling module`);
  module.exports = undefined;
}

