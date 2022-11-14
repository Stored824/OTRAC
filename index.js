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
    // QUERY TEAMS
    if(keyword=="*")
    {
        let queryString = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team"';
        teams = await client.query(queryString)
    }
    else
    {
        if(column=="WILDCARD")
        {
            
            let queryString = 'SELECT"Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team" WHERE "Team"."name" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."nickname" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."city" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."country" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Player"."name" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Player"."surname" LIKE \'' + keyword + '%\'';
            /*
            + 'OR '
            + '"Team"."expenses" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."income" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."value" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."championship_count" LIKE \'' + keyword + '%\'' + 'OR '
            + '"Team"."fan_count" LIKE \'' + keyword + '%\''; 
            */
            teams = await client.query(queryString)
        }
        else
        {
            let queryString = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team" WHERE "Team"."' + column + '" LIKE \'' + keyword + '%\''; 
            teams = await client.query(queryString)
        }

    }
    //console.log(teams.rows)
    return teams
}







const app = express();
client.connect()

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
const bodyParser = require("body-parser");
const { count } = require('console');
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