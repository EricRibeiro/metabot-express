import { Mongo } from "metabot-utils";
import express from 'express';
import dotenv from 'dotenv'

dotenv.config();
const app = express()
app.use(express.json());

app.use(function (req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

const port = process.env.PORT || 3000

app.post('/events', async (req, res) => {
  const document = req.body;
  const connString = process.env.MONGO_CONN_STRING!;

  console.log(`Request body: ${JSON.stringify(document)}`)

  const isEmpty = (obj: any) => {return obj && Object.keys(obj).length === 0 && obj.constructor === Object}

  if (isEmpty(document)) {
    console.log("Body is empty!");
    res.status(400).send({ error: "Request body cannot be empty." });
    return;
  };

  const { result, error } = await new Mongo(connString).insertOne("metabot", "analytics", document)

  if (error) {
    console.log(`Error saving on database: ${JSON.stringify(error)}`)
    res.send({ error });
    return;

  } else {
    console.log(`Saving on DB went all right: ${JSON.stringify(result)}`)
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