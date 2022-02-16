const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser Tidak Mendukung Untuk Local Storage');
    return false;
  }
  return true;
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.judulBuku;

  const textAuthor = document.createElement('p');
  textAuthor.classList.add('author');
  textAuthor.innerHTML = '<span> Penulis : ' + bookObject.penulisBuku + '</span>';

  const textYear = document.createElement('p');
  textYear.classList.add('year');
  textYear.innerHTML = '<span> Tahun : ' + bookObject.tahunBuku + '</span>';

  const textTimestamp = document.createElement('div');
  textTimestamp.innerText = bookObject.timestamp;

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(textTitle, textAuthor, textYear, textTimestamp);

  const containers = document.createElement('div');
  container.classList.add('item', 'shadow');
  containers.append(container);
  containers.setAttribute('id', `book-${bookObject.id}`);
  containers.setAttribute('class', 'content');
  containers.setAttribute('style', `display:flex`);

  if (bookObject.isCompleted) {
    const tombolUndo = document.createElement('img');
    tombolUndo.classList.add('tombol-undo');
    tombolUndo.setAttribute('src', 'assets/curved-arrow.png');
    tombolUndo.addEventListener('click', function () {
      undoBelumBaca(bookObject.id);
    });

    const tombolSampah = document.createElement('img');
    tombolSampah.classList.add('tombol-sampah');
    tombolSampah.setAttribute('src', 'assets/trash-bin.png');
    tombolSampah.addEventListener('click', function () {
      removeBuku(bookObject.id);
    });

    containers.append(tombolUndo, tombolSampah);
  } else {
    const checkComplete = document.createElement('img');
    checkComplete.classList.add('tombol-complete');
    checkComplete.setAttribute('src', 'assets/checked.png');
    checkComplete.addEventListener('click', function () {
      addSudahBaca(bookObject.id);
    });
    const tombolSampah = document.createElement('img');
    tombolSampah.classList.add('tombol-sampah');
    tombolSampah.setAttribute('src', 'assets/trash-bin.png');
    tombolSampah.addEventListener('click', function () {
      removeBuku(bookObject.id);
    });
    containers.append(checkComplete, tombolSampah);
  }

  return containers;
}

// Button
function findbooks(bookId) {
  for (booksItem of books) {
    if (booksItem.id === bookId) {
      return booksItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (i in books) {
    if (books[i].id === bookId) {
      return i;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addSudahBaca(bookId) {
  const target = findbooks(bookId);
  if (target == null) return;

  target.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeBuku(bookId) {
  const target = findbooks(bookId);
  if (target === -1) return;
  books.splice(target, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBelumBaca(bookId) {
  const target = findbooks(bookId);
  if (target == null) return;
  target.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// Akhir Button

function addBook() {
  const judulBuku = document.getElementById('inputBookTitle').value;
  const penulisBuku = document.getElementById('inputBookAuthor').value;
  const tahunBuku = document.getElementById('inputBookYear').value;
  const timestamp = document.getElementById('date').value;
  const checkType = document.getElementById('inputBookIsComplete');

  const generatedID = generateId();

  if (checkType.checked == true) {
    const bookObject = generateTodoObject(generatedID, judulBuku, penulisBuku, tahunBuku, timestamp, true);
    books.push(bookObject);
  } else {
    const bookObject = generateTodoObject(generatedID, judulBuku, penulisBuku, tahunBuku, timestamp, false);
    books.push(bookObject);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, judulBuku, penulisBuku, tahunBuku, timestamp, isCompleted) {
  return {
    id,
    judulBuku,
    penulisBuku,
    tahunBuku,
    timestamp,
    isCompleted,
  };
}

function loadDataBooks() {
  const dataBuku = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(dataBuku);

  if (data !== null) {
    for (buku of data) {
      books.push(buku);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataBooks();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooks = document.getElementById('books');
  uncompletedBooks.innerHTML = '';

  const completeBooks = document.getElementById('completedBooks');
  completeBooks.innerHTML = '';

  for (booksItem of books) {
    const bookElement = makeBook(booksItem);
    if (booksItem.isCompleted == false) {
      uncompletedBooks.append(bookElement);
    } else {
      completeBooks.append(bookElement);
    }
  }
});
