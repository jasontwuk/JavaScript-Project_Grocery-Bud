// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const inputbox = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// *** edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// *** submit form
form.addEventListener("submit", addItem);

// *** clear items
clearBtn.addEventListener("click", clearItems);

// *** load items
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(e){
    e.preventDefault();
    // console.log("added");

    const value = inputbox.value;
    // console.log(value);

    // *** create a unique id for each item
    // *** Note: need to use other way to create a better unique id in more serious project.
    const id = new Date().getTime().toString();
    // console.log(id);

    // *** when value is not empty and not in edit mode
    if(value && !editFlag){
        // console.log("add item to the list");

        // *** create list items
        createListItem(id, value);

        // *** show .inputbox-container
        container.classList.add("show-container");

        // *** display alert
        displayAlert("item added to the list", "success");

        // *** add to local storage
        addToLocalStorage(id, value);

        // *** set back to default
        setBackToDefault();

    } else if (value && editFlag){
        // console.log("editing");
        
        // *** change contents in chosen item
        // console.log(editElement);
        editElement.textContent = value;

        // *** edit local storage
        editLocalStorage(editID, value);

        // *** display alert
        displayAlert("value changed", "success");

        // *** set back to default
        setBackToDefault();
    } else {
        // console.log("empty value");
        displayAlert("please enter value", "danger");
    }
}

// *** display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // *** remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

// *** clear items
function clearItems(){
    const groceryItems = document.querySelectorAll(".grocery-item");

    if(groceryItems.length > 0){
        groceryItems.forEach(function(item){
            list.removeChild(item);
        });
    }

    // *** hide .grocery-container
    container.classList.remove("show-container");

    // *** display alert
    displayAlert("empty list", "danger");

    // *** set back to default
    setBackToDefault();

    // *** remove item from local storage
    localStorage.removeItem("list");
}

// *** delete function
function deleteItem(e){
    // console.log('item deleted');
    const chosenItem = e.currentTarget.parentElement.parentElement;
    const id = chosenItem.dataset.id;
    
    // *** remove item from list
    list.removeChild(chosenItem);
    if(list.children.length === 0){
        // *** hide .grocery-container
        container.classList.remove("show-container");
    }
    // *** display alert
    displayAlert("item deleted", "danger");

    // *** set back to default
    setBackToDefault();

    // *** remove from local storage
    removeFromLocalStorage(id);
}

// *** edit function
function editItem(e){
    const chosenItem = e.currentTarget.parentElement.parentElement;

    // *** set editFlag to true
    editFlag = true;

    // *** set editID
    editID = chosenItem.dataset.id;
    // console.log(editID);

    // *** set editElement
    editElement = chosenItem.querySelector(".title");
    // console.log(editElement);

    // *** display edit content in input text box
    inputbox.value = editElement.innerHTML;

    // *** change submit btn to edit btn
    submitBtn.textContent = "edit";
}

// *** set back to default
function setBackToDefault(){
    // console.log("set back to default");
    inputbox.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

// ****** LOCAL STORAGE **********
// *** localStorage API
// *** setItem, use JSON.stringify() to save as strings
// *** getItem, use JSON.parse() to parese data from localStorage
// *** removeItem

function addToLocalStorage(id, value){
    // console.log("added to local storage");
    const object = {id, value};
    let storageItem = getLocalStorage();
    // console.log(listArray);
    
    storageItem.push(object);
    // *** overwrite everything with new storageItem in localStorage
    localStorage.setItem("list", JSON.stringify(storageItem));
}
function getLocalStorage(){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}
function removeFromLocalStorage(id){
    let storageItem = getLocalStorage();

    storageItem = storageItem.filter(function(object){
        if(object.id !== id){
            return object;
        }
    });
    // console.log(storageItem);
    localStorage.setItem("list", JSON.stringify(storageItem));
};
function editLocalStorage(id, value){
    let storageItem = getLocalStorage();

    storageItem = storageItem.map(function(object){
        if(object.id === id){
            // assign new value
            object.value = value;
        }
        return object;
    });

    localStorage.setItem("list", JSON.stringify(storageItem));
};


// ****** SETUP ITEMS **********
function setupItems(){
    let listArray = getLocalStorage();

    if(listArray.length > 0){
        listArray.forEach(function(item){
            createListItem(item.id, item.value);
        });
        container.classList.add("show-container");
    }
}

function createListItem(id, value){
     // *** create item
     const item = document.createElement("article");

     // *** add class
     item.classList.add("grocery-item");

     // *** add attribute
     const attr = document.createAttribute("data-id");
     attr.value = id;
     item.setAttributeNode(attr);

     item.innerHTML = `<p class="title">${value}</p>
     <div class="btn-container">
       <button type="button" class="edit-btn">
         <i class="fas fa-edit"></i>
       </button>
       <button type="button" class="delete-btn">
         <i class="fas fa-trash"></i>
       </button>
     </div>`;
     // console.log(item);

     // *** Note: because we are adding .edit-btn and delete-btn dynamicly, we only can access them after they are created (inside const item), therefore we can access those buttons here.
     const deleteBtn = item.querySelector(".delete-btn");
     // console.log(deleteBtn);
     deleteBtn.addEventListener('click', deleteItem);

     const editBtn = item.querySelector(".edit-btn");
     editBtn.addEventListener('click', editItem);
     
     // *** add item to the list
     list.appendChild(item);
}