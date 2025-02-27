const urlBase = 'LAMPAPI';
const extension = 'php';

// API Endpoints
const endpoints = {
    addContact: `${urlBase}/AddContact.${extension}`,
    deleteContact: `${urlBase}/DeleteContact.${extension}`,
    updateContact: `${urlBase}/UpdateContact.${extension}`,
    createUser: `${urlBase}/Register.${extension}`,
    login: `${urlBase}/Login.${extension}`,
    searchContact: `${urlBase}/SearchContact.${extension}`
};

window.userData = window.userData || {
    UserId: 0,
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    UserName: ""
};

const doLogin = async () => {
    resetUserData();
    const button = document.getElementById("loginButton");
    
    const loginCredential = document.getElementById("loginCredential").value;
    const loginPassword = document.getElementById("loginPassword").value;
    
    if (!loginCredential || !loginPassword) {
        indicateError(button);
        return;
    }

    const requestData = { Login: loginCredential, Password: loginPassword };
    
    try {
        const response = await sendRequest("POST", endpoints.login, requestData);
        
        if (!response.success || !response.ID || response.ID < 1) {
            indicateError(button);
            return;
        }
        
        window.userData.userId = response.ID;
        window.userData.firstName = response.FirstName;
        window.userData.lastName = response.LastName;
        saveCookie();
        window.location.href = './Pages/Contact Manager/manager.html';
    } catch (error) {
        console.error("Login error:", error);
        indicateError(button);
    }
};

const addContact = async () => {
    const button = document.getElementById("addContactButton");
    
    const contactData = {
        Name: document.getElementById("nameText").value,
        Phone: document.getElementById("phoneNumber").value,
        Email: document.getElementById("emailText").value,
        UserId: window.userData.userId
    };
    
    if (!contactData.Name || !contactData.Phone || !contactData.Email) {
        indicateError(button);
        return;
    }
    
    try {
        await sendRequest("POST", endpoints.addContact, contactData);
        clearContactFields();
        indicateSuccess(button);
    } catch (error) {
        console.error("Add contact error:", error);
        indicateError(button);
    }
};

const createUser = async () => {
    const button = document.getElementById("createUserButton");
    
    const user = {
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
    
    try {
        const response = await sendRequest("POST", endpoints.createUser, user);
        window.userData.userId = response.userId;
        window.location.href = "/index.html";
    } catch (error) {
        console.error("Create user error:", error);
        indicateError(button);
    }
};

const sendRequest = async (method, url, data) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    };
    
    // if (method.toUpperCase() === 'POST') {
    //     options.body = JSON.stringify(data);
    // }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} \n Error: ${response.statusText}`);
    }
    
    return await response.json();
};

const saveCookie = () => {
    const minutes = 20;
    let expiration = new Date();
    expiration.setTime(expiration.getTime() + minutes * 60 * 1000);
    
    const cookieOptions = `; expires=${expiration.toUTCString()}; path=/`;
    document.cookie = `userId=${window.userData.userId}${cookieOptions}`;
    document.cookie = `firstName=${window.userData.firstName}${cookieOptions}`;
    document.cookie = `lastName=${window.userData.lastName}${cookieOptions}`;
};

const readCookie = () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('='); 
        if (key && value) {
            acc[key.trim()] = decodeURIComponent(value.trim()); 
        }
        return acc;
    }, {}); 

    const {userId, firstName, lastName} = cookies; 
    
    if(!userId) {
        window.location.href = "index.html"; 
    } else {
        const userNameElement = document.getElementById("userName");
        if (userNameElement) {
            userNameElement.innerHTML = `Logged in as ${firstName} ${lastName}`; 
        }
    }
};

const resetUserData = () => {
    window.userData = { 
        userId: 0, 
        firstName: "", 
        lastName: "", 
        email: "", 
        password: "", 
        username: "" 
    };
};

const doLogout = () => {
    resetUserData();
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "index.html";
};

const clearContactFields = () => {
    document.getElementById("nameText").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("emailText").value = "";
};

const indicateError = (button) => {
    button.style.backgroundColor = '#ae2b36';
    setTimeout(() => button.style.backgroundColor = "#238636", 650);
};

const indicateSuccess = (button) => {
    button.style.backgroundColor = 'blue';
    setTimeout(() => button.style.backgroundColor = "#238636", 650);
};