document.getElementById('button').addEventListener('click',loadText);
async function loadText()
{
    var xhr = new XMLHttpRequest();
    //get the data from the database

    xhr.open('POST','/server',true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
    


    xhr.send("column=country&keyword=Australia") 
    
}