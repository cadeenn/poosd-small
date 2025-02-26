const urlBase = 'LAMPAPI';
const extension = 'php';

// API Endpoints
const endpoints = {
    addContact: `${urlBase}/AddContact.${extension}`,
    deleteContact: `${urlBase}/DeleteContact.${extension}`,
    updateContact: `${urlBase}/UpdateContact.${extension}`,
    createUser: `${urlBase}/Create.${extension}`,
    login: `${urlBase}/Login.${extension}`,
    searchContact: `${urlBase}/SearchContact.${extension}`
};

// Ensure userData is properly initialized
if (!window.userData) {
    window.userData = {
        userId: 0,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        userName: ""
    };
}

function doLogin() {
    resetUserData();
    const button = document.getElementById("loginButton");
    
    let loginCredential = document.getElementById("loginCredential").value;
    let loginPassword = document.getElementById("loginPassword").value;
    
    if (!loginCredential || !loginPassword) {
        indicateError(button);
        return;
    }

    let requestData = { Login: loginCredential, Password: loginPassword };
    sendRequest("POST", endpoints.login, requestData, (response) => {
        if (!response || response.ID < 1) {
            indicateError(button);
            return;
        }
        
        window.userData.userId = response.ID;
        window.userData.firstName = response.FirstName;
        window.userData.lastName = response.LastName;
        saveCookie();
        window.location.href = './Pages/Contact Manager/manager.html';
    }, button);
}

function addContact() {
    const button = document.getElementById("addContactButton");
    
    let contactData = {
        Name: document.getElementById("nameText").value,
        Phone: document.getElementById("phoneNumber").value,
        Email: document.getElementById("emailText").value,
        UserId: window.userData.userId
    };
    
    if (!contactData.Name || !contactData.Phone || !contactData.Email) {
        indicateError(button);
        return;
    }
    
    sendRequest("POST", endpoints.addContact, contactData, () => {
        clearContactFields();
        indicateSuccess(button);
    }, button);
}

function createUser() {
    const button = document.getElementById("createUserButton");
    let user = {
        FirstName: document.getElementById("nameText").value,
        LastName: document.getElementById("lastText").value,
        Login: document.getElementById("usernameText").value,
        Password: document.getElementById("loginPassword").value,
        Email: document.getElementById("emailText").value
    };

    if (!user.FirstName || !user.LastName || !user.Login || !user.Password || !user.Email) {
        indicateError(button);
        return;
    }
    
    sendRequest("POST", endpoints.createUser, user, (response) => {
        window.userData.userId = response.userId;
        window.location.href = "/index.html";
    }, button);
}

function sendRequest(method, url, data, callback, button = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (callback) callback(response);
            } else {
                console.error("Error: ", xhr.status, xhr.statusText);
                if (button) indicateError(button);
            }
        }
    };
    
    xhr.send(JSON.stringify(data));
}

function saveCookie() {
    let expiration = new Date();
    expiration.setTime(expiration.getTime() + 20 * 60 * 1000);
    document.cookie = `userId=${window.userData.userId}; expires=${expiration.toUTCString()}; path=/`;
    document.cookie = `firstName=${window.userData.firstName}; expires=${expiration.toUTCString()}; path=/`;
    document.cookie = `lastName=${window.userData.lastName}; expires=${expiration.toUTCString()}; path=/`;
}

function resetUserData() {
    window.userData = { userId: 0, firstName: "", lastName: "", email: "", password: "", userName: "" };
}

function clearContactFields() {
    document.getElementById("nameText").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("emailText").value = "";
}

function indicateError(button) {
    button.style.backgroundColor = '#ae2b36';
    setTimeout(() => button.style.backgroundColor = "#238636", 650);
}

function indicateSuccess(button) {
    button.style.backgroundColor = 'blue';
    setTimeout(() => button.style.backgroundColor = "#238636", 650);
}