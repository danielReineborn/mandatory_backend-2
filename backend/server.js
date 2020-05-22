const express = require("express");

const {
  getClient,
  getDB,
  createObjectId
} = require("./db");
const fn = require("./Utils");
const PORT = 8080;
const app = express();


//Middelwares

app.use((req, res, next) => {
  fn.jsonParser(req, res, next);
});

app.use((req, res, next) => {
  let start = Date.now();
  res.once("finish", () => {
    let log = `Method: ${req.method}, Path: ${req.path}, Status: ${res.statusCode}, Response Time: ${Date.now()-start}`;
    console.log(log);
  })
  next();
})

app.get("/lists", (req, res) => {
  const db = getDB();
  db.collection("lists")
    .find({})
    .toArray()
    .then(result => {
      if (!result) return res.status(400).end();
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
    })
})

app.get("/cards/:listId", (req, res) => {
  let id = req.params.listId;

  const db = getDB();
  db.collection("cards")
    .find({
      list: createObjectId(id)
    })
    .toArray()
    .then(result => {
      if (!result) res.status(400).end();
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
    })
})

app.get("/checklists/:cardId", (req, res) => {
  let id = req.params.cardId;

  const db = getDB();
  db.collection("checklists")
    .find({
      card: createObjectId(id)
    })
    .toArray()
    .then(result => {
      if (!result) res.status(400).end();
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
    })
})

app.post("/lists", (req, res) => {
  let data = req.body;
  if (!data.name) return res.status(400).end();
  const db = getDB();
  db.collection("lists")
    .insertOne(data)
    .then(result => {
      data._id = result.insertedId;
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e);
      res.status(404).end();
    })

})

app.post("/cards", (req, res) => {
  let data = req.body;
  if (!data.list) return res.status(400).end();
  data.list = createObjectId(data.list);
  const db = getDB();
  db.collection("lists")
    .findOne({
      _id: createObjectId(data.list)
    })
    .then(result => {
      if (!result) return res.status(404).end();
      //this runs if validation is ok.
      data.created = Date.now();
      return db.collection("cards").insertOne(data)
    })
    .then(result => {
      data._id = result.insertedId; //string
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e)
      res.status(500).end();
    })
})

app.post("/cards/move/:cardId/lists/:listId", (req, res) => {
  let cardId = req.params.cardId;
  let listId = req.params.listId;
  const db = getDB();
  db.collection("lists")
    .findOne({
      _id: createObjectId(listId)
    })
    .then(result => {
      if (!result) return res.status(400).end();

      return db.collection("cards")
        .updateOne({
          _id: createObjectId(cardId)
        }, {
          $set: {
            list: createObjectId(listId)
          }
        })
    })
    .then(result => {
      if (!result) res.status(400).end();
      res.status(201).json(result);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })
})

app.post("/checklists", (req, res) => {
  let data = req.body;
  if (!data.card || !data.list || data.todo) return res.status(400).end();
  data.list = createObjectId(data.list);

  data.card = createObjectId(data.card);

  const db = getDB();
  console.log(data);
  db.collection("cards")
    .findOne({
      _id: createObjectId(data.card)
    })
    .then(result => {
      if (!result) return res.status(404).end();
      return db.collection("checklists").insertOne(data)
    })
    .then(result => {
      data._id = result.insertedId;
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })
})

app.patch("/lists/:listId", (req, res) => {
  let id = req.params.listId;
  let data = req.body;

  if (!id || !data.name) return res.status(400).end();

  const db = getDB();
  db.collection("lists")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      res.status(201).json(result) //checka result
    })
    .catch(e => {
      console.error(e)
      res.status(500).end();
    })

})

app.patch("/cards/:cardsId", (req, res) => {
  let id = req.params.cardsId;
  let data = req.body;
  let editableKeys = ["list", "name", "description"];
  if (!fn.validateData(data, editableKeys)) return res.status(400).end(); //Editable in card.

  const db = getDB();
  db.collection("cards")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      res.status(201).json(data); //checka result
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })
})

app.patch("/checklists/:todoId", (req, res) => {
  let id = req.params.todoId;
  let data = req.body;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("checklists")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      res.json(result) //checka result
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })

})

app.delete("/lists/:listId", (req, res) => {
  let id = req.params.listId;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("lists")
    .deleteOne({
      _id: createObjectId(id)
    })
    .then(result => {
      console.log("LIST:", result);
      res.status(204).end();

      return db.collection("cards").deleteMany({
        list: createObjectId(id),
      })
    })
    .then(result => {
      console.log("CARDS:", result)
      return db.collection("checklists").deleteMany({
        list: createObjectId(id)
      })
    })
    .then(result => {
      console.log("CHECKLISTS:", result);
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
    })
})

app.delete("/cards/:cardsId", (req, res) => {
  let id = req.params.cardsId;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("cards")
    .delete({
      _id: createObjectId(id)
    })
    .then(result => {
      res.status(204).end();
      return db.collection("checklists").deleteMany({
        card: createObjectId(id)
      })
    })
    .then(result => {
      console.log(result)
    })
})

app.delete("/checklists/:todoId", (req, res) => {
  let id = req.params.todoId;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("checklists")
    .remove({
      _id: createObjectId(id)
    })
    .then(result => {
      res.status(204).end();
    })

})


app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`)
})