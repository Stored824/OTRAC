const express = require('express');
const { writeFileSync } = require('fs')
const{Pool, Client} = require('pg')
const fs = require("fs");

const connectionString = 'postgressql://postgres:default@localhost:5432/TeamsAndPlayers'
const client = new Client({
    connectionString: connectionString

})

async function execute(column,keyword)
{
    client.connect()
    // GET TEAMS
    let queryString = 'SELECT * FROM "Team" WHERE "Team"."' + column + '" LIKE \'' + keyword + '\''; 
    teams = await client.query(queryString)
    //console.log(teams.rows)
    client.end()
    return teams
}







const app = express();

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

//Routing for receiving get requests
app.get("/server",function(req, res)
{
    console.log(req.body)
    teams = JSON.parse(fs.readFileSync('public/TeamsAndPlayers.json','utf8'))

    res.send(teams)
}
)

//Routing for receiving get requests
app.post("/server",async function(req, res)
{
    console.log(req.body)
    let column = req.body.column
    let keyword = req.body.keyword
    try {    
        let teams = await execute(column,keyword)
        res.send(teams.rows)
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
}
)