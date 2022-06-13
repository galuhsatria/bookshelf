const STORAGE_KEY = "BOOK_APPS";
 
let books = [];
 
function webStorageReady() {
   if(typeof(Storage) === undefined){
       alert("Browser anda tidak mendukung local storage");
       return false
   }
   return true;
}

function dataSaved() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
 }
  
 function dataLoaded() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null)
        books = data;
  
    document.dispatchEvent(new Event("ondataloaded"));
 }
  
 function updateDataToStorage() {
    if(isStorageExist())
        saveData();
 }
  
 function composebookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
 }
  
 function findbook(bookId) {
    for(book of books){
        if(book.id === bookId)
            return book;
    }
    return null;
 }
  
 function findbookIndex(bookId) {
    let index = 0
    for (book of books) {
        if(book.id === bookId)
            return index;
  
        index++;
    }
    return -1;
 }



const INCOMPLATE_BOOK = "incompleteBookshelfList";
const COMPLATE_BOOK = "completeBookshelfList"; 
const BOOK_ID = "itemId";

function addBook() {
    const incompleteBookshelfList = document.getElementById(INCOMPLATE_BOOK);
    const completeBookshelfList = document.getElementById(COMPLATE_BOOK);

    const judul = document.getElementById("judul").value;
    const penulis = document.getElementById("penulis").value;
    const tahun = document.getElementById("tahun").value;
    const isCompleted = document.getElementById("isCompleted").checked;

    const book = makeBook(judul, penulis, tahun, isCompleted);
    const bookObject = composebookObject(judul, penulis, tahun, isCompleted);
  
    book[BOOK_ID] = bookObject.id;
    books.push(bookObject);

    if(isCompleted==false){
        incompleteBookshelfList.append(book);
    }else{
        completeBookshelfList.append(book);
    }    

    updateDataToStorage();
}

function makeBook(judul, penulis, tahun, isCompleted){
    const judulBuku = document.createElement("h3");
    judulBuku.innerText = judul;
    judulBuku.classList.add("move")

    const penulisBuku = document.createElement("p");
    penulisBuku.innerText = penulis;

    const tahunTerbit = document.createElement('p');
    tahunTerbit.classList.add("year");
    tahunTerbit.innerText = tahun;

    const bookIsComplete = createCompleteButton();
    
    const hapusBuku = createRemoveButton();
    hapusBuku.innerText = "Hapus";
    
    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    if (isCompleted == true){
        bookIsComplete.innerText = "Belum selesai";
    }else{
        bookIsComplete.innerText = "Sudah selesai";
    }
    
    bookAction.append(bookIsComplete, hapusBuku);
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.append(judulBuku, penulisBuku, tahunTerbit, bookAction);
    
    return bookItem;
};

function createButton(buttonTypeClass , eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
};

function createCompleteButton(){
    return createButton("green", function(event){
        const parent = event.target.parentElement;
        addBookToCompleted(parent.parentElement);
    });
};

function removeBook(bookElement) {
    const bookPosition = findbookIndex(bookElement[BOOK_ID]);
    if (window.confirm("Apakah anda ingin menghapus buku ini dari rak?")){
        books.splice(bookPosition, 1);
        bookElement.remove();
    }
    updateDataToStorage();
};

function createRemoveButton(){
    return createButton("red", function(event){
        const parent = event.target.parentElement;
        removeBook(parent.parentElement);
    });
};

function addBookToCompleted(bookElement){
    const judulBukud = bookElement.querySelector(".book_item > h3").innerText;
    const penulisBukued = bookElement.querySelector(".book_item > p").innerText;
    const bookYeared = bookElement.querySelector(".year").innerText;
    const bookIsComplete = bookElement.querySelector(".green").innerText;

    if (bookIsComplete == "Sudah selesai"){
        const newBook = makeBook(judulBukud, penulisBukued, bookYeared, true)

        const book = findbook(bookElement[BOOK_ID]);
        book.isCompleted = true;
        newBook[BOOK_ID] = book.id;
        
        const completeBookshelfList = document.getElementById(COMPLATE_BOOK);
        completeBookshelfList.append(newBook);
    }else{
        const newBook = makeBook(judulBukud, penulisBukued, bookYeared, false)
        
        const book = findbook(bookElement[BOOK_ID]);
        book.isCompleted = false;
        newBook[BOOK_ID] = book.id;
        
        const incompleteBookshelfList = document.getElementById(INCOMPLATE_BOOK);
        incompleteBookshelfList.append(newBook);
    }
    bookElement.remove();

    updateDataToStorage();
};

function refreshDataFrombooks() {
    const listUncompleted = document.getElementById(INCOMPLATE_BOOK);
    const listCompleted = document.getElementById(COMPLATE_BOOK);
  
    for(book of books){
        const newbook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newbook[BOOK_ID] = book.id;
        
        if(book.isCompleted == false){
            listUncompleted.append(newbook);
        } else {
            listCompleted.append(newbook);
        }
    }
}

function searchBook() {
    const inputSearch = document.getElementById("searchjudulBuku").value;
    const moveBook = document.querySelectorAll(".move")
  
    for(move of moveBook){
        if (inputSearch !== move.innerText){
            console.log(move.innerText)
            move.parentElement.remove();
        } 
    }
}

document.addEventListener("DOMContentLoaded", function(){
    const submitBook = document.getElementById("inputBook");

    submitBook.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });
    
    const searchBooks = document.getElementById("searchBook");
    
    searchBooks.addEventListener("submit", function(event){
        event.preventDefault();
        searchBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    } 
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
 });
document.addEventListener("ondataloaded", () => {
    refreshDataFrombooks();
 });

function changeText(){
    const checkbox = document.getElementById("isCompleted");
    const textSubmit = document.getElementById("textSubmit");

    if(checkbox.checked == true){
        textSubmit.innerText = "Sudah selesai dibaca";
    }else{
        textSubmit.innerText = "Belum selesai dibaca";
    }
};