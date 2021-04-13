import { Mongo } from "metabot-utils";
import express from 'express';
import dotenv from 'dotenv'

dotenv.config();
const app = express()
app.use(express.json());

const port = process.env.PORT || 3000

app.post('/events', async (req, res) => {
  const document = req.body;
  const connString = process.env.MONGO_CONN_STRING!;

  if (!document) {
    res.status(400).send({ error: "Request body cannot be empty." });
    return;
  };

  const { result, error } = await new Mongo(connString).insertOne("metabot", "analytics", document)

  if (error) {
    res.send({ error });
    return;

  } else {
    res.status(200).send({ result });
    return;
  }
})

app.get('/', async (req, res) => {
  res.redirect("https://github.com/EricRibeiro/metabot-express");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})