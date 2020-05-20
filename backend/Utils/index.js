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

function validateData(data, acceptedKeys) {
  for (let key of acceptedKeys) {
    if (data.hasOwnProperty(key)) return true;
  }
  return false;

}

module.exports.jsonParser = jsonParser;
module.exports.validateData = validateData;