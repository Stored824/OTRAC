
document.getElementById('button').addEventListener('click',loadText);
var responseJSON
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
            responseJSON = this.responseText.row
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

        
        let name = row.insertCell(0);
        name.innerHTML = item.name;
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

    });
    old_tbody.parentNode.replaceChild(table, old_tbody)
}

document.getElementById('JSONbutton').addEventListener('click',downloadJSON);
function downloadJSON() { 
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responseJSON));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
}

document.getElementById('JSONbutton').addEventListener('click',downloadJSON);
function downloadCSV() {
    responseCSV = csvFromJSON(responseJSON);
    var dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(responseCSV);
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",dataStr);
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
}

function csvFromJSON()
{

}