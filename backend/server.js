const express = require("express");

const {
  getClient,
  getDB,
  createObjectId,
  validId
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

//Routes
app.get("/lists", (req, res) => {
  const db = getDB();
  db.collection("lists")
    .find({})
    .toArray()
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result, check endpoint."
      });
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

//Get specific list.
app.get("/lists/:listId", (req, res) => {
  let id = req.params.listId;
  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });
  const db = getDB();

  db.collection("lists")
    .findOne({
      _id: createObjectId(id),
    })
    .then(result => {
      console.log(result);
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      })
    })
})

//ListId is required to get connected cards.
app.get("/cards/lists/:listId", (req, res) => {
  let id = req.params.listId;

  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });
  const db = getDB();
  db.collection("cards")
    .find({
      list: createObjectId(id)
    })
    .toArray()
    .then(result => {
      if (!result) res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})
//Get specific card
app.get("/cards/:cardId", (req, res) => {
  console.log(req.params)
  let id = req.params.cardId;
  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });
  const db = getDB();
  db.collection("cards")
    .find({
      _id: createObjectId(id),
    })
    .toArray()
    .then(result => {
      if (!result) res.status(404).send({
        error: "No result found, check endpoint/ID."
      })
      res.json({
        data: result,
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      })
    })
})

app.get("/checklists/:cardId", (req, res) => {
  let id = req.params.cardId;
  id = createObjectId(id);
  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });

  const db = getDB();
  db.collection("checklists")
    .find({
      card: createObjectId(id)
    })
    .toArray()
    .then(result => {
      if (!result) res.status(404).send({
        error: "No result found, check endpoint/ID."
      })
      res.status(200).json({
        data: result
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.post("/lists", (req, res) => {
  let data = req.body;
  if (!data.name) return res.status(400).send({
    error: "Name key is required."
  });
  const db = getDB();
  db.collection("lists")
    .insertOne(data)
    .then(result => {
      data._id = result.insertedId;
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.post("/cards", (req, res) => {
  let data = req.body;
  if (!data.list) return res.status(400).send({
    error: "ListId that card belongs to is required"
  });
  data.list = createObjectId(data.list);
  const db = getDB();
  db.collection("lists")
    .findOne({
      _id: createObjectId(data.list)
    })
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      data.created = Date.now();
      return db.collection("cards").insertOne(data)
    })
    .then(result => {
      data._id = result.insertedId;
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e)
      res.status(500).send({
        error: e
      });
    })
})

app.post("/checklists", (req, res) => {
  let data = req.body;
  if (!data.card || !data.todo) return res.status(400).send({
    error: "Card and todo keys are required. Card in which todo belongs."
  });

  data.card = createObjectId(data.card);

  const db = getDB();
  db.collection("cards")
    .findOne({
      _id: createObjectId(data.card)
    })
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      return db.collection("checklists").insertOne(data)
    })
    .then(result => {
      data._id = result.insertedId;
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.patch("/lists/:listId", (req, res) => {
  let id = req.params.listId;
  let data = req.body;
  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });
  if (!data.name) return res.status(400).send({
    error: "Name key is required in request."
  });

  const db = getDB();
  db.collection("lists")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });

      res.status(201).json(result);
    })
    .catch(e => {
      console.error(e)
      res.status(500).send({
        error: e
      });
    })

})

app.patch("/cards/:cardsId", (req, res) => {
  let id = req.params.cardsId;
  let data = req.body;

  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });

  let editableKeys = ["list", "name", "description"];
  if (!fn.validateData(data, editableKeys)) return res.status(400).send({
    error: "Key is not editable."
  });

  const db = getDB();
  db.collection("cards")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      res.status(201).json(data);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.patch("/checklists/:todoId", (req, res) => {
  let id = req.params.todoId;
  let data = req.body;

  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });

  let editableKeys = ["done", "card", "todo"];
  if (!fn.validateData(data, editableKeys)) return res.status(400).send({
    error: "Key is not editable."
  });

  const db = getDB();
  db.collection("checklists")
    .updateOne({
      _id: createObjectId(id)
    }, {
      $set: data
    }, )
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });

      res.status(201).json(result)
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.patch("/cards/move/:cardId/lists/:listId", (req, res) => {
  let cardId = req.params.cardId;
  let listId = req.params.listId;

  if (validId(cardId) === false) return res.status(400).send({
    error: "card-Id is not valid."
  });
  if (validId(listId) === false) return res.status(400).send({
    error: "list-Id is not valid."
  });

  const db = getDB();
  db.collection("lists")
    .findOne({
      _id: createObjectId(listId)
    })
    .then(result => {
      if (!result) return res.status(404).send({
        error: "No result found, check endpoint/ID."
      });

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
      if (!result) res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      res.status(201).json(result);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.delete("/lists/:listId", (req, res) => {
  let id = req.params.listId;

  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });

  let cardIds = [];
  const db = getDB();
  db.collection("lists")
    .deleteOne({
      _id: createObjectId(id)
    })
    .then(result => {
      if (!result) res.status(404).send({
        error: "No result found, check endpoint/ID."
      });
      res.status(204).end();

      return db.collection("cards").find({
        list: createObjectId(id),
      }).toArray()
    })
    .then(result => {
      for (let data of result) {
        cardIds.push(createObjectId(data._id));
      }

      return db.collection("cards").deleteMany({
        list: createObjectId(id)
      })
    })
    .then(result => {
      return db.collection("checklists").deleteMany({
        card: {
          $in: cardIds
        }
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.delete("/cards/:cardsId", (req, res) => {
  let id = req.params.cardsId;

  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });
  const db = getDB();
  db.collection("cards")
    .deleteOne({
      _id: createObjectId(id)
    })
    .then(result => {
      res.status(204).end();
      return db.collection("checklists").deleteMany({
        card: createObjectId(id)
      })
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})

app.delete("/checklists/:todoId", (req, res) => {
  let id = req.params.todoId;

  if (validId(id) === false) return res.status(400).send({
    error: "Id is not valid."
  });

  const db = getDB();
  db.collection("checklists")
    .deleteOne({
      _id: createObjectId(id)
    })
    .then(result => {
      res.status(204).end();
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({
        error: e
      });
    })
})


app.listen(PORT, () => {
  console.log(`Listening on localhost:${PORT}`)
})