// GlobalVariable.js
const GlobalVariable = {
    loggedInUser: JSON.parse(localStorage.getItem("userData"))
};

export default GlobalVariable;
