/* TODO 9: Membuat variabel untuk menampung data objek sekaligus RENDER_EVENT sebagai 
custom event saat ada perubahan data. */
const books = [];
const RENDER_EVENT = 'render-book';
// TODO 22: Membuat variabel untuk custom event menyimpan data sekaligus storage key.
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

// TODO 8: Membuat data objek untuk data buku.
function generateId() {
    return +new Date();
};

function createBookObject(id, title, author, year, isCompleted){
  return {
      id, title, author, year, isCompleted
  }
};

// TODO 7: Menambahkan fungsi addBook() yang berfungsi untuk menambahkan data buku.
function addBook() {
    const generatedID = generateId();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const bookObject = createBookObject(generatedID, title, author, year, isCompleted);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));

    /* TODO 20: Pada fungsi addBook(), addBookToCompleted(), removeBook(), dan undoBook(),
    ditambahkan kode untuk memanggil fungsi saveData(). */
    saveData();
  }

// TODO 11: Membuat fungsi makeBook() untuk menampilkan data yang telah dimasukkan.
function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement ('p');
  textYear.innerText = "Tahun:  " + bookObject.year;

  const bookShelf = document.createElement('article');
  bookShelf.classList.add('book_item');
  bookShelf.append(textTitle, textAuthor, textYear);

  const bookShelfButton = document.createElement('div');
  bookShelfButton.classList.add('action');
  bookShelf.append(bookShelfButton);

  // TODO 13: Menampilkan tombol-tombol.

  if (bookObject.isCompleted) {
    const markUncompleteBookButton = document.createElement('button');
    markUncompleteBookButton.classList.add('green');
    markUncompleteBookButton.innerText = "Tandai Belum Selesai";
    markUncompleteBookButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });

    const removeCompletedBookButton = document.createElement('button');
    removeCompletedBookButton.classList.add('red');
    removeCompletedBookButton.innerText = "Hapus";
    removeCompletedBookButton.addEventListener('click', function() {
      removeBook(bookObject.id);
    });

    bookShelfButton.append(markUncompleteBookButton, removeCompletedBookButton);

  } else {
    const markCompletedBookButton = document.createElement('button');
    markCompletedBookButton.classList.add('green');
    markCompletedBookButton.innerText = "Tandai Selesai";
    markCompletedBookButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    const removeUncompletedBookButton = document.createElement('button');
    removeUncompletedBookButton.classList.add('red');
    removeUncompletedBookButton.innerText = "Hapus";
    removeUncompletedBookButton.addEventListener('click', function() {
      removeBook(bookObject.id);
    });

    bookShelfButton.append(markCompletedBookButton, removeUncompletedBookButton);
  }

  return bookShelf;

}

// TODO 14: Menambahkan fungsi addBookToCompleted() untuk menandai sebuah buku yang selesai dibaca.
function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

// TODO 15: Menambahkan fungsi findBook() untuk mencari buku berdasarkan nomor ID.
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

/* TODO 18: Menambahkan fungsi removeBook() & undoBookFromCompleted() untuk menghapus data buku
sekaligus menandai sebuah buku yang belum selesai dibaca.*/
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

/* TODO 19: Menambahkan fungsi findBookIndex() untuk memfungsikan penghapusan data buku
berdasarkan indeks ID.*/
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// TODO 21: Menambahkan fungsi saveData() untuk menyimpan data buku ke dalam local storage.
function saveData() {
  if (isStorageExist()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/* TODO 23: Menambahkan fungsi isStorageExist() untuk memeriksa apakah browser dapat menyimpan
data.*/
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser tidak mendukung penyimpanan data');
    return false;
  }
  return true;
}

// TODO 25: Menambahkan fungsi loadDataFromStorage() untuk mengambil data dalam storage.
 function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null){
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
 }

 /* TODO 6: Membuat listener untuk menjalankan kode saat semua elemen HTML sudah dimuat
 dan menjadi DOM. */
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    // TODO 26: Jika ada data pada storage, tampilkan!
    if (isStorageExist()){
      loadDataFromStorage();
    }
  });

// TODO 10: Membuat listener RENDER_EVENT.
document.addEventListener(RENDER_EVENT, function () {
  // TODO 12: Menambahkan makeBook() pada RENDER_EVENT.
    const uncompleteBookList = document.getElementById('incompleteBookshelfList');
    uncompleteBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      /* TODO 16: Jika data buku yang dimasukkan belum selesai dibaca, maka data akan masuk
      pada rak buku yang belum selesai dibaca.*/
      if(!bookItem.isCompleted) {
        uncompleteBookList.append(bookElement);
        /* TODO 17: Jika sudah selesai dibaca, maka data akan masuk pada rak buku yang
        sudah selesai dibaca. */
      } else {
        completedBookList.append(bookElement);
      }
    }
  });

/* TODO 24: Membuat listener SAVED_EVENT untuk melihat setiap perubahan dalam
penyimpanan data. */
document.addEventListener(SAVED_EVENT, function(){
  console.log(localStorage.getItem(STORAGE_KEY));
});

