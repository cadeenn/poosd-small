// API configuration
const urlBase = 'http://localhost/LAMPAPI'; // CHANGE ME
const extension = 'php';

// API endpoints in an object for better organization
const endpoints = {
  addContact: `${urlBase}/AddContact.${extension}`,
  deleteContact: `${urlBase}/DeleteContact.${extension}`,
  updateContact: `${urlBase}/UpdateContact.${extension}`,
  createUser: `${urlBase}/Create.${extension}`,
  login: `${urlBase}/Login.${extension}`,
  searchContact: `${urlBase}/SearchContact.${extension}`
};

// User session data
let session = {
  userId: 0,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  userName: ""
};

// Helper functions
const showTemporaryError = (element, message, duration = 650) => {
  const errorElement = document.querySelector(".error-message") || document.querySelector(".error-message-update");
  if (errorElement) errorElement.innerHTML = message;
  
  if (element) {
    element.style.backgroundColor = '#ae2b36';
    setTimeout(() => {
      element.style.backgroundColor = "#238636";
    }, duration);
  }
};

const validatePhoneFormat = (phone) => {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
};

// API request helper
const sendRequest = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Login function
const doLogin = async () => {
  // Reset session data
  Object.keys(session).forEach(key => session[key] = "");
  
  const errorMessage = document.querySelector(".error-message");
  const button = document.getElementById("loginButton");
  const loginCredential = document.getElementById("loginCredential").value;
  const loginPassword = document.getElementById("loginPassword").value;
  
  if (!loginCredential || !loginPassword) {
    showTemporaryError(button, "Empty Field");
    return;
  }
  
  try {
    const jsonObject = await sendRequest(endpoints.login, {
      Login: loginCredential,
      Password: loginPassword
    });
    
    session.userId = jsonObject.ID;
    
    if (session.userId < 1) {
      document.getElementById("loginCredential").value = "";
      document.getElementById("loginPassword").value = "";
      showTemporaryError(button, "Wrong Credentials");
      return;
    }
    
    session.firstName = jsonObject.FirstName;
    session.lastName = jsonObject.LastName;
    
    saveCookie();
    window.location.href = './Pages/Contact Manager/manager.html';
  } catch (err) {
    document.getElementById("loginCredential").value = "";
    document.getElementById("loginPassword").value = "";
    showTemporaryError(button, "Wrong Credentials");
    console.error(err.message);
  }
};

// Logout function
const doLogout = () => {
  // Reset session data
  Object.keys(session).forEach(key => session[key] = "");
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/index.html";
};

// Create user function
const createUser = async () => {
  const firstName = document.getElementById("nameText").value;
  const lastName = document.getElementById("lastText").value;
  const email = document.getElementById("emailText").value;
  const password = document.getElementById("loginPassword").value;
  const userName = document.getElementById("usernameText").value;
  const button = document.getElementById("createUserButton");
  
  if (!firstName || !lastName || !userName || !password || !email) {
    showTemporaryError(button, "Empty Field");
    return;
  }
  
  try {
    const jsonObject = await sendRequest(endpoints.createUser, {
      FirstName: firstName,
      LastName: lastName,
      Login: userName,
      Password: password,
      Email: email
    });
    
    session.userId = jsonObject.userId;
    console.log(`${session.userId} has been created`);
    
    button.style.backgroundColor = 'blue';
    setTimeout(() => {
      button.style.backgroundColor = "#238636";
    }, 650);
    
    window.location.href = "/index.html";
  } catch (err) {
    showTemporaryError(button, "Something Went Wrong");
    console.error(err.message);
  }
};

// Add contact function
const addContact = async () => {
  const contactName = document.getElementById("nameText").value;
  const contactPhone = document.getElementById("phoneNumber").value;
  const contactEmail = document.getElementById("emailText").value;
  const button = document.getElementById("addContactButton");
  
  if (!contactName || !contactPhone || !contactEmail) {
    showTemporaryError(button, "Empty Field");
    return;
  }
  
  if (!validatePhoneFormat(contactPhone)) {
    showTemporaryError(button, "Phone Number Format 123-456-7890");
    return;
  }
  
  try {
    await sendRequest(endpoints.addContact, {
      Name: contactName,
      Phone: contactPhone,
      Email: contactEmail,
      UserId: session.userId
    });
    
    document.getElementById("nameText").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("emailText").value = "";
    
    button.style.backgroundColor = 'blue';
    setTimeout(() => {
      button.style.backgroundColor = "#238636";
    }, 650);
    
    searchAll();
    
    const contactList = document.querySelector(".contact-list");
    setTimeout(() => {
      contactList.scrollTop = contactList.scrollHeight;
    }, 1000);
    
    document.querySelector(".error-message").innerHTML = "";
  } catch (err) {
    showTemporaryError(button, "Something Went Wrong");
    console.error(err.message);
  }
};

// Delete contact function
const deleteContact = async (id) => {
  const parent = document.getElementById(id);
  const contactName = parent.querySelector('.contact-list-name').textContent.trim();
  const contactPhone = parent.querySelector('.contact-list-phone').textContent.trim();
  const contactEmail = parent.querySelector('.contact-list-email').textContent.trim();
  
  parent.remove();
  
  try {
    await sendRequest(endpoints.deleteContact, {
      Name: contactName,
      Phone: contactPhone,
      Email: contactEmail,
      UserId: session.userId
    });
    console.log("Contact Deleted Successfully");
  } catch (err) {
    console.error(err.message);
  }
};

// Update window function
const updateWindow = (id) => {
  const parent = document.getElementById(id);
  const contactName = parent.querySelector('.contact-list-name').textContent.trim();
  const contactPhone = parent.querySelector('.contact-list-phone').textContent.trim();
  const contactEmail = parent.querySelector('.contact-list-email').textContent.trim();
  const rightContainer = document.querySelector(".right-container");
  
  // Create update window container
  const window = document.createElement('div');
  window.className = "update-container";
  rightContainer.appendChild(window);
  
  // Create window elements
  const elements = {
    close: document.createElement('button'),
    name: document.createElement('p'),
    phone: document.createElement('input'),
    email: document.createElement('input'),
    errorMessage: document.createElement('div'),
    update: document.createElement('button')
  };
  
  // Set element attributes
  elements.close.className = "close-window";
  elements.name.className = "update-name";
  
  elements.phone.type = "text";
  elements.phone.className = "update-phone";
  elements.phone.id = "UpdatePhoneNew";
  
  elements.email.type = "text";
  elements.email.className = "update-email";
  elements.email.id = "updateEmailNew";
  
  elements.errorMessage.className = "error-message-update";
  
  elements.update.className = "update-contact";
  elements.update.id = "contactUpdateButton";
  
  // Set element content
  elements.close.innerHTML = "X";
  elements.name.innerHTML = contactName;
  elements.phone.placeholder = `Update Phone: ${contactPhone}`;
  elements.email.placeholder = `Update Email: ${contactEmail}`;
  elements.update.innerHTML = "Update";
  
  // Add event listeners
  elements.close.addEventListener("click", () => {
    window.remove();
    searchAll();
  });
  
  elements.update.addEventListener("click", () => {
    updateContact(contactName);
  });
  
  // Append elements to container
  Object.values(elements).forEach(element => window.appendChild(element));
};

// Update contact function
const updateContact = async (contactName) => {
  const phone = document.getElementById("UpdatePhoneNew").value;
  const email = document.getElementById("updateEmailNew").value;
  const phoneHolder = document.getElementById("UpdatePhoneNew");
  const emailHolder = document.getElementById("updateEmailNew");
  const button = document.getElementById("contactUpdateButton");
  const errorMessage = document.querySelector(".error-message-update");
  
  if (!phone || !email) {
    showTemporaryError(button, "Empty Field");
    return;
  }
  
  if (!validatePhoneFormat(phone)) {
    errorMessage.innerHTML = "Phone Number Format 123-456-7890";
    return;
  }
  
  try {
    await sendRequest(endpoints.updateContact, {
      Name: contactName,
      Phone: phone,
      Email: email
    });
    
    console.log("Contact Updated Successfully");
    
    phoneHolder.placeholder = `Update Phone: ${phone}`;
    emailHolder.placeholder = `Update Email: ${email}`;
    
    phoneHolder.value = "";
    emailHolder.value = "";
    
    button.style.backgroundColor = 'blue';
    setTimeout(() => {
      button.style.backgroundColor = "#238636";
    }, 650);
    
    errorMessage.innerHTML = "";
  } catch (err) {
    errorMessage.innerHTML = "Something Went Wrong";
    console.error(err.message);
  }
};

// Create contact element function
const createContactElement = (contact, index) => {
  const newAddedPerson = document.createElement('div');
  newAddedPerson.className = "added-person";
  newAddedPerson.id = `id${index}`;
  
  // Create elements
  const elements = {
    name: document.createElement('p'),
    phone: document.createElement('p'),
    email: document.createElement('p'),
    updateBtn: document.createElement('button'),
    deleteBtn: document.createElement('button'),
    updateIcon: document.createElement('img'),
    deleteIcon: document.createElement('img'),
    nameBox: document.createElement('div'),
    phoneBox: document.createElement('div'),
    emailBox: document.createElement('div'),
    actionsBox: document.createElement('div')
  };
  
  // Set classes and attributes
  elements.name.className = "contact-list-name";
  elements.phone.className = "contact-list-phone";
  elements.email.className = "contact-list-email";
  
  elements.updateIcon.src = "../../Images/updateIcon.png";
  elements.deleteIcon.src = "../../Images/deleteIcon.png";
  
  elements.updateBtn.className = "update-button";
  elements.deleteBtn.className = "delete-button";
  
  elements.nameBox.className = "name-list-box";
  elements.phoneBox.className = "phone-list-box";
  elements.emailBox.className = "email-list-box";
  elements.actionsBox.className = "actions-list-box";
  
  // Set content
  elements.name.innerHTML = contact.Name;
  elements.phone.innerHTML = contact.Phone;
  elements.email.innerHTML = contact.Email;
  
  // Add event listeners
  elements.updateBtn.addEventListener("click", () => updateWindow(newAddedPerson.id));
  elements.deleteBtn.addEventListener("click", () => deleteContact(newAddedPerson.id));
  
  // Construct the element hierarchy
  elements.updateBtn.appendChild(elements.updateIcon);
  elements.deleteBtn.appendChild(elements.deleteIcon);
  
  elements.nameBox.appendChild(elements.name);
  elements.phoneBox.appendChild(elements.phone);
  elements.emailBox.appendChild(elements.email);
  elements.actionsBox.appendChild(elements.updateBtn);
  elements.actionsBox.appendChild(elements.deleteBtn);
  
  newAddedPerson.appendChild(elements.nameBox);
  newAddedPerson.appendChild(elements.phoneBox);
  newAddedPerson.appendChild(elements.emailBox);
  newAddedPerson.appendChild(elements.actionsBox);
  
  return newAddedPerson;
};

// Search contact function
const searchContact = async () => {
  const search = document.getElementById("searchText").value;
  
  if (!search) {
    document.getElementById("searchText").placeholder = "PLEASE INSERT CONTACT NAME";
    setTimeout(() => {
      document.getElementById("searchText").placeholder = "Search";
    }, 1500);
    return;
  }
  
  try {
    const jsonObject = await sendRequest(endpoints.searchContact, {
      Name: search,
      UserId: session.userId
    });
    
    const showContact = document.querySelector(".contact-list");
    showContact.innerHTML = "";
    
    if (jsonObject.results && jsonObject.results.length > 0) {
      jsonObject.results.forEach((contact, index) => {
        const contactElement = createContactElement(contact, index);
        showContact.appendChild(contactElement);
      });
    } else {
      const noResults = document.createElement('p');
      noResults.innerHTML = "No contacts found";
      showContact.appendChild(noResults);
    }
  } catch (err) {
    document.getElementById("searchText").placeholder = "NO CONTACT FOUND";
    setTimeout(() => {
      document.getElementById("searchText").placeholder = "Search";
    }, 1500);
    
    console.error(err.message);
  }
};

// Search all contacts function
const searchAll = async () => {
  try {
    const jsonObject = await sendRequest(endpoints.searchContact, {
      Name: "",
      UserId: session.userId
    });
    
    const showContact = document.querySelector(".contact-list");
    showContact.innerHTML = "";
    
    if (jsonObject.results && jsonObject.results.length > 0) {
      jsonObject.results.forEach((contact, index) => {
        const contactElement = createContactElement(contact, index);
        showContact.appendChild(contactElement);
      });
    } else {
      const noResults = document.createElement('p');
      noResults.innerHTML = "No contacts found";
      showContact.appendChild(noResults);
    }
  } catch (err) {
    document.getElementById("searchText").placeholder = "NO CONTACT FOUND";
    setTimeout(() => {
      document.getElementById("searchText").placeholder = "Search";
    }, 650);
    
    console.error(err.message);
  }
};

// Login as guest function
const doLoginGuest = async () => {
  // Reset session data
  Object.keys(session).forEach(key => session[key] = "");
  
  const button = document.getElementById("loginButton");
  
  try {
    const jsonObject = await sendRequest(endpoints.login, {
      Login: "Admin",
      Password: "Admin"
    });
    
    session.userId = jsonObject.ID;
    
    if (session.userId < 1) {
      showTemporaryError(button, "");
      return;
    }
    
    session.firstName = jsonObject.FirstName;
    session.lastName = jsonObject.LastName;
    
    saveCookie();
    window.location.href = './Pages/Contact Manager/manager.html';
  } catch (err) {
    showTemporaryError(button, "");
    console.error(err.message);
  }
};

// Cookie functions
const saveCookie = () => {
  const minutes = 20;
  const date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  
  document.cookie = `firstName=${session.firstName}; expires=${date.toUTCString()}; path=/`;
  document.cookie = `lastName=${session.lastName}; expires=${date.toUTCString()}; path=/`;
  document.cookie = `userId=${session.userId}; expires=${date.toUTCString()}; path=/`;
};

const readCookie = () => {
  const cookies = document.cookie.split("; ");
  
  // Reset session values
  session.firstName = "";
  session.lastName = "";
  session.userId = "";
  
  cookies.forEach(cookie => {
    const [key, value] = cookie.split("=");
    
    if (key === "firstName") {
      session.firstName = decodeURIComponent(value);
    } else if (key === "lastName") {
      session.lastName = decodeURIComponent(value);
    } else if (key === "userId") {
      session.userId = decodeURIComponent(value);
    }
  });
  
  console.log("Session data loaded from cookies:", {
    firstName: session.firstName,
    lastName: session.lastName,
    userId: session.userId
  });
};