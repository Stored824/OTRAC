const { writeFileSync } = require('fs')
const{Pool, Client} = require('pg')
const fs = require("fs");

const connectionString = 'postgressql://postgres:default@localhost:5432/TeamsAndPlayers'
const client = new Client({
    connectionString: connectionString

})

async function execute()
{
    client.connect()
    // GET TEAMS
    teams = await client.query('SELECT * FROM "Team"')
    //console.log(teams.rows)
    writeFileSync("teams.json",JSON.stringify(teams.rows))

    // GET PLAYERS
    players = await client.query('SELECT * FROM "Player" ORDER BY "Player"."current_team"')
    //console.log(players.rows)
    writeFileSync("players.json",JSON.stringify(players.rows))
    
     
    client.end()

}
execute()

teams = JSON.parse(fs.readFileSync('./teams.json','utf8'))
players = JSON.parse(fs.readFileSync('./players.json','utf8'))

teams.forEach(team => {
    current_players = []
    players.forEach(player =>
    {
        if(player['current_team'] == team['Team_ID'])
        {
            current_players.push(player)
        }
    })
    team['players'] = current_players
});

writeFileSync("TeamsAndPlayers.json",JSON.stringify(teams))
