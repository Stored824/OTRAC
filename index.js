const express = require('express');
const { writeFileSync } = require('fs')
const{Pool, Client} = require('pg')
const fs = require("fs");

const connectionString = 'postgressql://postgres:default@localhost:5432/TeamsAndPlayers'
const client = new Client({
    connectionString: connectionString

})

//TAKE THE LIST OF TEAMS AND PLAYERS AND MAKE A HIERACHICAL STRUCTURE
function hierachical(teamsAndPlayers)
{
    var teams = {}

}


async function getAllData(column,keyword)
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
            
            let queryString = 'SELECT"Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team" WHERE "Team"."name" LIKE \''+ '%' + keyword + '%\'' + 'OR '
            + '"Team"."nickname" LIKE \''+ '%' + keyword + '%\'' + 'OR '
            + '"Team"."city" LIKE \''+ '%' + keyword + '%\'' + 'OR '
            + '"Team"."country" LIKE \''+ '%' + keyword + '%\'' + 'OR '
            + '"Player"."name" LIKE \'' + '%'+ keyword + '%\'' + 'OR '
            + '"Player"."surname" LIKE \''+ '%' + keyword + '%\'';
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

async function getAllTeams()
{
    let queryTeamSelect = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team"'
    teams = await client.query(queryTeamSelect)
    return teams

}


async function getTeamByNickname(nickname)
{
    let queryTeamSelect = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team"'
    let queryTeamWhereClause ='WHERE "Team"."nickname" =\'' + nickname + '\''
    let queryString =  queryTeamSelect + queryTeamWhereClause;
    teams = await client.query(queryString)
    return teams

}
async function getTeamFromID(teamID)
{
    let queryTeamSelect = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team"'
    let queryTeamWhereClause = 'WHERE "Team"."Team_ID" =' + teamID
    let queryString =  queryTeamSelect + queryTeamWhereClause;
  
    teams = await client.query(queryString)
    return teams
}




async function getPlayerFromID(playerID)
{
    let queryPersonSelect = 'SELECT "Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM  "Player"'
    let queryPersonWhereClause = 'WHERE "Player"."Player_ID" =' + playerID;
    let queryString = queryPersonSelect + queryPersonWhereClause
    players = await client.query(queryString)
    return players
}


async function getPlayerByMinimumSalary(minSalary)
{
    let queryPersonSelect = 'SELECT "Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM  "Player"'
    let queryPersonWhereClause = 'WHERE "Player"."salary" >=' + minSalary
    let queryString = queryPersonSelect + queryPersonWhereClause
    players = await client.query(queryString)
    return players
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


/*
****************************
 *  GET ALL TEAMS
****************************
*/


//Routing for receiving all of the data requests
app.get("/api.local/allTeams",async function(req, res)
{
    console.log("HERE")
    try {    
        let teams = await getAllData("WILDCARD","*")

        //TODO: parse the teams rows and get a hierachical structure
        res.send(teams.rows)
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
})

/*
****************************
 *  GET TEAM WITH ID
****************************
*/
app.get("/api.local/team/:uid",async function(req, res)
{
    let teamID = req.params.uid
    try {    
        let teams = await getTeamFromID(teamID)
        if(!teams.rows || teams.rows.length == 0)
        {
            res.status(404).send("No teams found, check id value");
        }
        else res.send(teams.rows)
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
})


app.get("/api.local/team/nickname/:nickname",async function(req, res)
{
    let nickname = req.params.nickname
    try {    
        let teams = await getTeamByNickname(nickname)
        if(!teams.rows || teams.rows.length == 0)
        {
            res.status(404).send("No teams found, check nickname value");
        }
        else res.send(teams.rows)
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
})



app.get("/api.local/player/:uid",async function(req, res)
{
    let playerID = req.params.uid
    try {    
        let players = await getPlayerFromID(playerID)
        if(!players.rows || players.rows.length === 0)
        {
            res.status(404).send("No players found, check id value");
        }
        else {res.send(players.rows)}
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
})

app.get("/api.local/player/salary/:salary",async function(req, res){
    let minSalary = req.params.salary;
    try {    
        let players = await getPlayerByMinimumSalary(minSalary)
        if(!players.rows || players.rows.length === 0)
        {
            res.status(404).send("No players found, check salary value");
        }
        else {res.send(players.rows)}
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }

})

//TODO: OPENGPL spec 
app.get("api.local/specification",async function(res,req)
{
    res.send();
})


//Routing for receiving requests with search queries
app.post("/server",async function(req, res)
{
    console.log("POST body" + req.body)
    let column = req.body.column
    let keyword = req.body.keyword
    try {    
        let teams = await getAllData(column,keyword)
        res.send(teams.rows)
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
})