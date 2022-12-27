
document.getElementById('button').addEventListener('click',loadText);
var responseJSON
var responseJSONtoCSV

function jsonToCsv(items) {
    var csvString = 'Team Name,Nickname,City,Country,Expenses,Income,Value,Championships Won,Number of Fans,Player Name,Surname,Average Points Scored,Average Assists Made,Current Salary\n'
    items.forEach(item => {
        csvString += item.Team_ID+",";
        csvString += item.teamname+",";
        csvString += item.nickname+",";
        csvString += item.city+",";
        csvString += item.country+",";
        csvString += item.expenses+",";
        csvString += item.income+",";
        csvString += item.value+",";
        csvString += item.championship_count+",";
        csvString += item.fan_count+",";
        csvString += item.name+",";
        csvString += item.surname+",";
        csvString += item.points+",";
        csvString += item.assists+",";
        csvString += item.salary+",";
        csvString +="\n"
    });
    return csvString;
}




async function loadText()
{
    var xhr = new XMLHttpRequest();

    xhr.open('POST','/server',true)

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function()
    {
        if(this.status == 200)
        {
            console.log(this.responseText)
            responseJSON = this.responseText;
            responseJSONtoCSV = this.responseText;
            loadTableData(this.responseText)
        }


    }
    xhr.onerror = function()
    {
        console.log("Request error...")
    }
    

    let keyword = document.getElementById("pretraga").value;
    let column = document.getElementById("kategorija").value; 

    xhr.send("column=" + column + "&keyword=" + keyword) 
    
}

function loadTableData(string) {
    let items = JSON.parse(string)
    var table = document.createElement("tbody");
    table.id="tableBody";
    const old_tbody = document.getElementById("tableBody");
    items.forEach( item => {
        let row = table.insertRow();

        
        let teamname = row.insertCell(0);
        teamname.innerHTML = item.teamname;
        let nickname = row.insertCell(1);
        nickname.innerHTML = item.nickname;
        let city = row.insertCell(2);
        city.innerHTML = item.city;
        let country = row.insertCell(3);
        country.innerHTML = item.country;
        let expenses = row.insertCell(4);
        expenses.innerHTML = item.expenses;
        let income = row.insertCell(5);
        income.innerHTML = item.income;
        let value = row.insertCell(6);
        value.innerHTML = item.value;
        let champ = row.insertCell(7);
        champ.innerHTML = item.championship_count;
        let fans = row.insertCell(8);
        fans.innerHTML = item.fan_count;
        let name = row.insertCell(9);
        name.innerHTML= item.name;
        let surname = row.insertCell(10);
        surname.innerHTML = item.surname;
        let points = row.insertCell(11);
        points.innerHTML = item.points;
        let assists = row.insertCell(12);
        assists.innerHTML = item.assists;
        let salary = row.insertCell(13);
        salary.innerHTML = item.salary;

    });
    old_tbody.parentNode.replaceChild(table, old_tbody)
}

document.getElementById('JSONbutton').addEventListener('click',downloadJSON);
function downloadJSON() { 
    console.log(responseJSON);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(responseJSON);
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", "teamsAndPlayers.json");
    dlAnchorElem.click();
}

document.getElementById('CSVbutton').addEventListener('click',downloadCSV);
function downloadCSV() {
    
    responseJSONtoCSV = JSON.parse(responseJSONtoCSV);
    console.log(responseJSON);
    var responseCSV = jsonToCsv(responseJSONtoCSV);
    console.log(responseCSV);
    var dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(responseCSV);
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", "teamsAndPlayers.csv");
    dlAnchorElem.click();
}


