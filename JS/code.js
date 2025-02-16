const urlBase = 'http://group6.cadeen.me';
const extension = 'php';

let userId = 0;
let firstName = '';
let lastName = '';
let email = '';
let password = '';
let userName = '';

document.getElementById("loginForm").addEventListener("submit", doLogin);

function doLogin(event) {
    console.log("is this workinggg");
    event.preventDefault();

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    document.getElementById("loginResult").innerHTML = "";

    if (login === "" || password === "") {
        document.getElementById("loginResult").innerHTML = "Please enter both login and password.";
        return;
    }

    let tmp = { username: login, password: password }; 
    let jsonPayload = JSON.stringify(tmp);
    let url = "http://group6.cadeen.me/LAMPAPI/users/Login.php";
 

    console.log("doLogin still working"); //Checking

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Server Response:", xhr.responseText);
            if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let userId = jsonObject.id;  // Declared with let
                localStorage.setItem("userId", userId);

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                let firstName = jsonObject.firstName;  // Declared inside function
                let lastName = jsonObject.lastName;

                window.location.href = "search_contact.html";
            } else {
                document.getElementById("loginResult").innerHTML = "Error: " + xhr.status;
            }
        }
    };

    xhr.onerror = function () {
        document.getElementById("loginResult").innerHTML = "Network error. Please try again.";
    };

    try {
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = "Request failed: " + err.message;
    }
}


function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function addUser(event)
{
    event.preventDefault();
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    document.getElementById("userAddResult").innerHTML = "";

    let tmp = {
        firstname: firstName,
        lastname: lastName, 
        username: username, 
        password: password
    };

    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/AddUser.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log("function triggered"); // Check if function is being called
                document.getElementById("userAddedResult").innerHTML = "User has been added";
                window.location.href = "index.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("userAddedResult").innerHTML = err.message;
    }

}

function addContact() {

    event.preventDefault();
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let userId = localStorage.getItem("userId");

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        name: name,
        phone: phone,
        email: email,
        userId: userId
    };

    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                console.log("function triggered"); 
                document.getElementById("contactAddResult").innerHTML = "User has been added";
                window.location.href = "search_contact.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }

}


function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("userAddedResult").innerHTML = ""; 

    let contactList = "";

    let firstname = localStorage.getItem("firstName") || "Unknown";
    let lastname = localStorage.getItem("lastName") || "Unknown";

    let tmp = {
        search: srch,
        firstname: firstname,
        lastname: lastname
    };

    console.log("Search data:", tmp); 
}


