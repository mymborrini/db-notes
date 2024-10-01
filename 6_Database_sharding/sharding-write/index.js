const app = require('express')();
const {Client} = require('pg');
const crypto = require('crypto');
const HashRing = require('hashring');
const { url } = require('inspector');

// Hash rank
const hr = new HashRing();

hr.add("5432");
hr.add("5433");
hr.add("5434");

// Key is the port and values is the configuration
const clients = {
  "5432": new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres"
  }),
  "5433": new Client({
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "postgres",
    database: "postgres"
  }),
  "5434": new Client({
    host: "localhost",
    port: 5434,
    user: "postgres",
    password: "postgres",
    database: "postgres"
  })
}


async function connect() {
  await clients["5433"].connect();
  await clients["5432"].connect();
  await clients["5434"].connect();

}

connect();

app.get("/:urlid", async (req, res) => {

  const urlId = req.params.urlid;
  const server = hr.get(urlId);
  
  const result = await clients[server].query("select * from URL_TABLE where url_table.url_id = $1", [urlId])

  if (result.rowCount > 0) {
    res.send({
      urlId: urlId,
      url: result.rows[0],
      server: server
    })
  } else {

    res.sendStatus(404);
    
  }

})

app.get("/", (req, res) => {
  res.send('a')
})

app.post("/", async (req, res) => {

  // Write a new row
  const url = req.query.url;
  const hash = crypto.createHash("sha256").update(url).digest('hex');
  const urlId = hash.substr(0,5);

  const server = hr.get(urlId);

  await clients[server].query("insert into URL_TABLE(url, url_id) values($1, $2)", [url, urlId]);


  res.send({
    urlId: urlId,
    url: url,
    server: server
  })
  

  // Consistently hash to get a port


})

app.listen(8081, () => console.log("Listening to port 8081"));