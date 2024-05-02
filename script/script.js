let titleNotice = [];
let valueNotice = [];
let trashGarbageTitle = [];
let trashGarbageValue = [];
loadNewNotiz();
loadTrash();

/* Render Notizen */
function render() {
  let notesContent = document.getElementById('notes-content');

  notesContent.innerHTML = '';
  for (let i = 0; i < titleNotice.length; i++) {
    notesContent.innerHTML += generateHtmlRender(i);
  }
}

/* Generiert HTML für Render() */
function generateHtmlRender(i) {
  const newTitleNotice = titleNotice[i];
  const newValueNotice = valueNotice[i];

  return /*html*/ `
      <div class="notes">
        <h1>${newTitleNotice}</h1>
        <li>${newValueNotice}</li>
        <button class="btn-delete" onclick="deleteNoticeToTrash(${i})">&times</button>
        <button class="btn-edit" onclick="editNote(${i})"><img src="/img/edit-2-48.png" alt="Notiz Bearbeiten"></button>
      </div>
    `;
}

/* Render Mülleimer */
function renderTrash() {
  let trashContent = document.getElementById('trash');

  trashContent.innerHTML = '';
  for (let i = 0; i < trashGarbageTitle.length; i++) {
    trashContent.innerHTML += generateHtmlTrash(i);
  }
}

/* Generiert HTML für Mülleimer */
function generateHtmlTrash(i) {
  const newtrashGarbageTitle = trashGarbageTitle[i];
  const newtrashGarbageValue = trashGarbageValue[i];

  return /*html*/ `
      <div class="notes">
        <h1>${newtrashGarbageTitle}</h1>
        <li>${newtrashGarbageValue}</li>
        <button onclick="removeToNotes(${i})">Wiederherstellen</button>
        <button onclick="deleteFinally(${i})">Entgültig Löschen</button>
      </div>
    `;
}

/* Eine Notiz hinzufügen */
function addNewNotice() {
  let newTitleNotice = document.getElementById('title-value');
  let newValueNotice = document.getElementById('notice-value');

  let errorTitle = document.getElementById('error__title-value');
  let errorNotice = document.getElementById('error__notice-value');

  if (newTitleNotice.value.length == 0) {
    errorTitle.innerHTML = 'Bitte gib einen Titel an!';
  } else if (newValueNotice.value.length == 0) {
    errorNotice.innerHTML = 'Bitte Schreibe etwas in die Notizen!';
  } else {
    titleNotice.push(newTitleNotice.value);
    valueNotice.push(newValueNotice.value);
    errorTitle.innerHTML = '';
    errorNotice.innerHTML = '';

    render();
    save();

    newTitleNotice.value = '';
    newValueNotice.value = '';
  }
}

/* Notizen in den Mülleimer verschieben */
function deleteNoticeToTrash(i) {
  trashGarbageTitle.push(titleNotice[i]);
  trashGarbageValue.push(valueNotice[i]);

  titleNotice.splice(i, 1);
  valueNotice.splice(i, 1);
  save();
  saveTrash();
  renderTrash();
  render();
}

/* Trash array im local storage speichern */
function saveTrash() {
  let trashGarbageTitleAsText = JSON.stringify(trashGarbageTitle); /* Das array wird in einen text umgewandelt */
  localStorage.setItem('Title-trash', trashGarbageTitleAsText); /* Der umgewandelte text wird jetzt im local storage gespeichert */

  let trashGarbageValueAsText = JSON.stringify(trashGarbageValue);
  localStorage.setItem('Notiz-trash', trashGarbageValueAsText);
}

/* Ein array im local storage speichern */
function save() {
  let titleNoticeAsText = JSON.stringify(titleNotice); /* Das array wird in einen text umgewandelt */
  localStorage.setItem('Title', titleNoticeAsText); /* Der umgewandelte text wird jetzt im local storage gespeichert */

  let valueNoticeAsText = JSON.stringify(valueNotice);
  localStorage.setItem('Notiz', valueNoticeAsText);
}

/* Ein array aus dem local storage laden */
function loadNewNotiz() {
  let titleNoticeAsText = localStorage.getItem('Title');
  let valueNoticeAsText = localStorage.getItem('Notiz');

  if (titleNoticeAsText && valueNoticeAsText) {
    titleNotice = JSON.parse(titleNoticeAsText);
    valueNotice = JSON.parse(valueNoticeAsText);
  }
}

/* Ein array trash aus dem local storage laden */
function loadTrash() {
  let trashGarbageTitleAsText = localStorage.getItem('Title-trash');
  let trashGarbageValueAsText = localStorage.getItem('Notiz-trash');

  if (trashGarbageTitleAsText && trashGarbageValueAsText) {
    trashGarbageTitle = JSON.parse(trashGarbageTitleAsText);
    trashGarbageValue = JSON.parse(trashGarbageValueAsText);
  }
}

/* Array Löschen */
function deleteFinally(i) {
  trashGarbageTitle.splice(i, 1);
  trashGarbageValue.splice(i, 1);
  renderTrash(i);
  saveTrash();
  save();
}

/* Array aus Mülleimer wieder in Notizen */
function removeToNotes(i) {
  titleNotice.push(trashGarbageTitle[i]);
  valueNotice.push(trashGarbageValue[i]);
  trashGarbageTitle.splice(i, 1);
  trashGarbageValue.splice(i, 1);
  renderTrash(i);
  saveTrash();
  save();
  render();
}

/* Notiz bearbeiten */
function editNote(i) {
  showEditeNotice();

  let editNoteContent = document.getElementById('editNote');

  editNoteContent.innerHTML = generateHtmlEditNote(i);
}

/* Generiert HTML für Notiz bearbeiten */
function generateHtmlEditNote(i) {
  let editTitle = titleNotice[i];
  let editNotice = valueNotice[i];

  return /*html*/ `
  <div class="notes">
    <form class="flex-column">
    <input id="edit-title-value" class="border-none" type="text"  value="${editTitle}">
    <textarea id="edit-notice-value" class="border-none" cols="30" rows="10">${editNotice}</textarea>
    </form>
    <button onclick="editNoteSave(${i})">Speichern</button>
    <button onclick="removeEditeNotice()">Ohne speichern schließen</button>
  </div>
`;
}

/* Notiz bearbeiten Speichern */
function editNoteSave(i) {
  let edititleNotice = document.getElementById('edit-title-value');
  let editValueNotice = document.getElementById('edit-notice-value');

  // titleNotice.splice(i, 1, edititleNotice.value);
  // valueNotice.splice(i, 1, editValueNotice.value);
  titleNotice[i] = edititleNotice.value;
  valueNotice[i] = editValueNotice.value;

  save();
  loadNewNotiz();
  render();
  showNotice();
}

/* Button für Sidebar */
function showNotice() {
  document.getElementById('main').classList.remove('display-none');
  document.getElementById('trash').classList.remove('display-flex');
  document.getElementById('editNote').classList.remove('display-flex');
}

function showTrash() {
  document.getElementById('main').classList.add('display-none');
  document.getElementById('trash').classList.add('display-flex');
  document.getElementById('editNote').classList.remove('display-flex');
}

/* Notiz bearbeiten anzeigen / nicht anzeigen */
function showEditeNotice() {
  document.getElementById('main').classList.add('display-none');
  document.getElementById('editNote').classList.add('display-flex');
}

function removeEditeNotice() {
  document.getElementById('main').classList.remove('display-none');
  document.getElementById('editNote').classList.remove('display-flex');
}
