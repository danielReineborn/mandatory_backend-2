function jsonParser(req, res, next) {
  let body = "";
  if (req.is("json")) {
    req.on("data", (chunk) => {
      body += chunk;
    })
    req.on("end", () => {
      try {
        req.body = JSON.parse(body);
        next();
      } catch (e) {
        console.error(e);
        res.status(404).end();
      }
    })
  } else {
    next();
  }
}

function toArray(array, key) {
  let rv = [];
  rv.push(array[0][key]);
  let j = 0;
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key].toString() !== rv[j].toString()) {
      rv.push(array[i][key].toString());
      j += 1;
    }
  }

  return rv;

}

function includeDataInLists(array, key, newKey, includeArray, includeKey) {
  for (let data of array) {
    data[newKey] = includeArray.filter(x => x[includeKey] === data[key]);
  }
  return array;
}

module.exports.jsonParser = jsonParser;
module.exports.toArray = toArray;
module.exports.includeDataInLists = includeDataInLists;