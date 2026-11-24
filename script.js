var books = JSON.parse(localStorage.getItem("books")) || [];

var bookForm = document.getElementById("bookForm");
var bookList = document.getElementById("bookList");
var searchBox = document.getElementById("search");
var emptyMessage = document.getElementById("emptyMessage");

function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var book = {
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    category: document.getElementById("category").value.trim(),
    issuedTo: null,
    dueDate: null
  };

  books.push(book);
  saveBooks();
  bookForm.reset();
  showBooks();
});

function issueBook(id) {
  var name = prompt("Enter the member's name:");
  if (!name || name.trim() === "") {
    return;
  }

  var due = new Date();
  due.setDate(due.getDate() + 14);

  for (var i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books[i].issuedTo = name.trim();
      books[i].dueDate = due.toDateString();
    }
  }

  saveBooks();
  showBooks();
}

function returnBook(id) {
  for (var i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      books[i].issuedTo = null;
      books[i].dueDate = null;
    }
  }

  saveBooks();
  showBooks();
}

function deleteBook(id) {
  if (!confirm("Delete this book?")) {
    return;
  }

  books = books.filter(function (book) {
    return book.id !== id;
  });

  saveBooks();
  showBooks();
}

searchBox.addEventListener("input", showBooks);

function showBooks() {
  var text = searchBox.value.toLowerCase();
  bookList.innerHTML = "";

  var shown = 0;

  for (var i = 0; i < books.length; i++) {
    var book = books[i];

    var searchable = (book.title + " " + book.author + " " + book.category).toLowerCase();
    if (searchable.indexOf(text) === -1) {
      continue;
    }

    shown++;
    var isIssued = book.issuedTo !== null;
    var row = document.createElement("tr");

    var statusHtml = isIssued
      ? '<span class="badge issued">Issued</span>' +
        '<span class="issued-info">To ' + escapeHtml(book.issuedTo) + ', due ' + book.dueDate + '</span>'
      : '<span class="badge available">Available</span>';

    var actionHtml = isIssued
      ? '<button class="btn-return" onclick="returnBook(' + book.id + ')" >Return</button>'
      : '<button onclick="issueBook(' + book.id + ')" >Issue</button>';

    row.innerHTML =
      "<td>" + escapeHtml(book.title) + "</td>" +
      "<td>" + escapeHtml(book.author) + "</td>" +
      "<td>" + escapeHtml(book.category) + "</td>" +
      "<td>" + statusHtml + "</td>" +
      "<td>" + actionHtml +
      '<button class="btn-delete" onclick="deleteBook(' + book.id + ')" >Delete</button></td>';

    bookList.appendChild(row);
  }

  emptyMessage.style.display = shown === 0 ? "block" : "none";
  updateCounts();
}

function updateCounts() {
  var issued = 0;
  for (var i = 0; i < books.length; i++) {
    if (books[i].issuedTo !== null) {
      issued++;
    }
  }

  document.getElementById("totalCount").textContent = books.length;
  document.getElementById("issuedCount").textContent = issued;
  document.getElementById("availableCount").textContent = books.length - issued;
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

showBooks();
