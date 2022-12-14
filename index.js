const express = require('express');
const { writeFileSync } = require('fs')
const{Pool, Client} = require('pg')
const fs = require("fs");
const {auth} = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: '8MVfofLc1xL5qfiXycXJGoQMz2lwYIrK9aUbyK0u6c6czJSux6AjoPzW_w11DWzy',
    baseURL: 'http://localhost:3000',
    clientID: '9dUPrYfgsTdjBhfqjsJM7uCrhcd7iWRc',
    issuerBaseURL: 'https://dev-k5qmvfuerpnyepmh.us.auth0.com'
  };

const connectionString = 'postgressql://postgres:default@localhost:5432/TeamsAndPlayers'
const client = new Client({
    connectionString: connectionString

})

/*
function hideBoth(log)  { 

    if(log)
    {
        document.getElementById("loggedIn").style.visibility="hidden";  
        document.getElementById("NotLoggedIn").style.visibility="visible";
    }
    else
    {
        document.getElementById("loggedIn").style.visibility="visible";  
        document.getElementById("NotLoggedIn").style.visibility="hidden";   
    } 
}
*/

function addLDToTeamJSON(teamJSON)
{
    response = {
        "@context" : {
            "@vocab" :"https://schema.org",
            "surname": "familyName",
            "teamname" : "name",
            "nickname" : "alternateName"    
        }
    }

    
    console.log(teamJSON)
    //FOR EACH TEAM
    //ADD THE SPORTS TEAM TYPE
    for(var team of teamJSON)
    {

        //UPDATE THE CITY AND COUNTRY VALUE
        team["@type"] = "SportsTeam"
        country = team["country"]
        city = team["city"]
        team["country"] =
        {
            "@type" : "Country",
            "name" : country
        }
        team["city"] = 
        {
            "@type" : "City",
            "name" : city
        }

        //FOR EACH PLAYER
        //ADD THE SPORTS TEAM TYPE
        for(var player of team["players"])
        {
            player["@type"] = "Person"
        }
    }
    response["teams"] = teamJSON 

    // ADD THE CONTEXT OBJECT
    return response
}

//ADD THE PLAYERS FROM EACH TEAM
async function hierachical(teams)
{
    console.log(teams.rows)
    let queryPlayerSelect = 'SELECT "Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM  "Player"'
    let queryPlayerWhereClause = 'WHERE "Player"."current_team" =';
    for(var element of teams.rows)
    {
        queryString = queryPlayerSelect + queryPlayerWhereClause + element["Team_ID"]
        players = await client.query(queryString)
        element["players"] = players.rows
        console.log(players)
        
    }

    //TODO: ADD SEMANTIC ANALISYS TO THE RESPONSE
    return addLDToTeamJSON(teams.rows)

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
    let queryTeamSelect = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count" FROM "Team"'
    teams = await client.query(queryTeamSelect)
    teams = hierachical(teams) // get the players
    return teams
}

async function changeData(id,column,changeValue)
{
    let response = await client.query('UPDATE "OTRAC."Team" SET ' + column + ' = \'' + changeValue + '\' WHERE "Team"."Team_ID"\'' + id + '\'')
    console.log(response)
}

async function deleteData(id)
{
    let response = await client.query('DELETE FROM "Team" WHERE "Team"."Team_ID" = \'' + id + "\'")
    console.log(response)
}
async function addData(values)
{
    valuesQueryString = "("
    for(var value of values)
    {
        valuesQueryString += "\'"
        valuesQueryString += value
        valuesQueryString += "\'"
        valuesQueryString += ","
    }
    valuesQueryString = valuesQueryString.substring(0, valuesQueryString.length-1);
    valuesQueryString += ")"
    let response = await client.query('INSERT INTO "Team" VALUES' + valuesQueryString)
    console.log(response)
}

async function getTeamByNickname(nickname)
{
    let queryTeamSelect = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count","Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM "Team" INNER JOIN "Player" ON "Team"."Team_ID" = "Player"."current_team"'
    let queryTeamWhereClause ='WHERE "Team"."nickname" =\'' + nickname + '\''
    let queryString =  queryTeamSelect + queryTeamWhereClause;
    teams = await client.query(queryString)
    teams = hierachical(teams.rows) // get the players

    return teams

}
async function getTeamFromID(teamID)
{
    let queryTeamSelect = 'SELECT "Team"."Team_ID","Team"."name" AS teamname,"Team"."nickname","Team"."city","Team"."country","Team"."expenses","Team"."income","Team"."value","Team"."championship_count","Team"."fan_count" FROM "Team"'
    let queryTeamWhereClause = 'WHERE "Team"."Team_ID" =' + teamID
    let queryString =  queryTeamSelect + queryTeamWhereClause;
  
    teams = await client.query(queryString)
    teams = hierachical(teams) // get the players
    return teams
}




async function getPlayerFromID(playerID)
{
    let queryPlayerSelect = 'SELECT "Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM  "Player"'
    let queryPlayerWhereClause = 'WHERE "Player"."Player_ID" =' + playerID;
    let queryString = queryPlayerSelect + queryPlayerWhereClause
    players = await client.query(queryString)
    return players
}


async function getPlayerByMinimumSalary(minSalary)
{
    let queryPlayerSelect = 'SELECT "Player"."Player_ID","Player"."name","Player"."surname","Player"."points","Player"."assists","Player"."salary","Player"."current_team" FROM  "Player"'
    let queryPlayerWhereClause = 'WHERE "Player"."salary" >=' + minSalary
    let queryString = queryPlayerSelect + queryPlayerWhereClause
    players = await client.query(queryString)
    return players
}



const app = express();
client.connect()

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(auth(config));
const bodyParser = require("body-parser");
const { count } = require('console');
app.use(bodyParser.urlencoded({
    extended: true
}));
//TODO: ADD AUTHENTICATION MIDDLEWARE

/*
app.use('/', (req, res) => {
    console.log("HERE I AM")
    console.log('Is authenticated: ' + req.oidc.isAuthenticated())
    //hideBoth(req.oidc.isAuthenticated())
    res.render("index",{
        isAuthenticated:req.oidc.isAuthenticated()
    });
  });

*/
/*
****************************
 *  GET ALL TEAMS
****************************
*/

app.get("/api.local/example",async function(req, res)
{
    try {   

        let teams = JSON.parse(fs.readFileSync('./teamLDExample.json','utf8'))
        res.send(teams)
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
})


//Routing for receiving all of the data requests
app.get("/api.local/allTeams",async function(req, res)
{
    try {   

        let teams = await getAllTeams()

        res.send(teams)
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
        if(!teams["teams"] || teams["teams"] === 0)
        {
            res.status(404).send("No teams found, check id value");
        }
        else res.send(teams)
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

//TODO: OPENAPI spec 
app.get("/api.local/specification",async function(req,res)
{
    openapi = JSON.parse(fs.readFileSync('./openapi.json','utf8'))
    res.send(openapi);
})


//CHANGE A VALUE OF THE TEAM WITH THE GIVEN ID USING THE BODY OF THE PUT METHOD

app.put("/api.local/team/:uid",async function(req, res)
{
    let teamId = req.params.uid
    //console.log(req)
    jsonMessage = JSON.parse(Object.keys(req.body)[0])
    let column = jsonMessage.column
    let changedValue = jsonMessage.changedValue
    console.log(teamId)
    console.log(column)
    console.log(changedValue)
    try {    
        await changeData(teamId, column, changedValue)
        res.sendStatus(201);
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }

})
//DELETE THE TEAM WITH THE GIVEN ID
app.delete("/api.local/team/:uid",async function(req, res)
{
    //get all the values from the request body
    teamID = req.params.uid
    console.log(teamID)
    try {    
        await deleteData(teamID)
        res.sendStatus(200);
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }
    

})

//ADD A TEAM WITH THE GIVEN ELEMENTS IN THE BODY
app.post("/api.local/team",async function(req, res)
{
    //get all the values from the request body
    console.log(req.body)
    values = "["
    values += Object.keys(req.body)
    values += "]"
    values = JSON.parse(values)
    console.log(values)
    try {    
        await addData(values)
        res.sendStatus(201);
    } catch(e) {
        // catch errors and send error status
        console.log(e);
        res.sendStatus(500);
    }

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