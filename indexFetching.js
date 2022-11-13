document.getElementById('button').addEventListener('click',loadText);
async function loadText()
{
    const connectionString = 'postgressql://postgres:default@localhost:5432/TeamsAndPlayers'
    const client = new Client({
    connectionString: connectionString

    })
    var xhr = new XMLHttpRequest();
    //get the data from the database
    document.getElementById("response").innerHTML = teams
    
    xhr.open('GET','TeamsAndPlayers.json',true)
    
    xhr.onload = function()
    {
        if(this.status == 200)
        {
            console.log(this.responseText)
            document.getElementById("response").innerHTML = this.responseText 
        }


    }
    xhr.onerror = function()
    {
        console.log("Request error...")
    }
    
    
    
    xhr.send();
    
}