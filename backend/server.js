/* 
lists:
{
  _id: ObjectId,
  name: string,
  listId: "2309oweifjslkdfw0"
}

cards: 
{
  _id: ObjectId,
  list: string,
  name: string,
  date: string,
  description: string,
  comment: string,
  checklist: id -> use this id to match with todos?
}

todos: 
{
  _id: ObjectId,
  checklist: id -> matching with card.checklist.
  task: string,
  done: boolean,
}

{
  lists: [

    {name: string,
      _id: 2349sdkfaf,
      cards: [
        {
          list: 
          checklist: [
            {id: asdfa,

            }
          ]
        }
      ]}
  ]
}
*/
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
/* app.use(express.json()); */ //Write own json middleware.

app.use((req, res, next) => {
  fn.jsonParser(req, res, next);
});

app.use((req, res, next) => {
  let start = Date.now();
  res.once("finish", () => {
    console.log(`Method: ${req.method}, Path: ${req.path}, Status: ${res.statusCode} Response Time: ${Date.now()-start}`)
  })
  next();
})

//Map response to a single datastructure? 
//.find({key: {$in: ["value1", "value2"]}})
app.get("/lists", (req, res) => {
  let data = {};
  const db = getDB();
  db.collection("lists")
    .find({})
    .toArray()
    .then(lists => {
      data.lists = lists;

      let names = fn.toArray(lists, "name");
      return db.collection("cards").find({
        list: {
          $in: names
        },
      }).toArray()
    })
    .then(cardsRes => {
      data.cards = cardsRes;
      let checklists = fn.toArray(cardsRes, "checklist");
      console.log(checklists);
      return db.collection("checklists").find({
        checklist: {
          $in: checklists
        }
      }).toArray()
    })
    .then(checklistRes => {

      for (let card of data.cards) {
        card.checklist = checklistRes.filter(x => x.checklist === card.checklist);
      }
      for (let list of data.lists) {
        list.cards = data.cards.filter(x => x.list === list.name);
      }
      delete data.cards;

      res.json({
        data: data,
      });
    })
    .catch(e => {
      console.error(e);
      res.status(500).end();
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
  const db = getDB();
  db.collection("lists")
    .findOne({
      name: data.list
    })
    .then(result => {
      if (!result) return res.status(404).end();
      //this runs if validation is ok.
      return db.collection("cards").insertOne(data)
    })
    .then(result => {
      data._id = result.insertedId;
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e)
      res.status(500).end();
    })

})
app.post("/checklists", (req, res) => {
  let data = req.body;
  if (!data.checklist) return res.status(400).end();
  const db = getDB();
  console.log(data);
  db.collection("cards")
    .findOne({
      checklist: data.checklist
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

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("lists")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      res.send(result) //checka result
    })

})

app.patch("/cards/:cardsId", (req, res) => {
  let id = req.params.cardsId;
  let data = req.body;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("cards")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      res.send(result) //checka result
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
      res.send(result) //checka result
    })

})

app.delete("/lists/:listId", (req, res) => {
  let id = req.params.listId;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("lists")
    .remove({
      _id: createObjectId(id)
    })
    .then(result => {
      res.status(204).end();
    })
})

app.delete("/cards/:cardsId", (req, res) => {
  let id = req.params.cardsId;

  if (!id) return res.status(400).end();
  const db = getDB();
  db.collection("cards")
    .remove({
      _id: createObjectId(id)
    })
    .then(result => {
      res.status(204).end();
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