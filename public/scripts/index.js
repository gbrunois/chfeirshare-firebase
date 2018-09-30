document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('content').style.display = '';
  removeOnLoadingElement();
  try {
    onAuthStateChanged(authStateChanged);
    watchBeers(onNewBeerAdded, onBeerUpdated, onBeerDeleted);
  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML =
      'Error loading the Firebase SDK, check the console.';
  }
});

function authStateChanged(user) {
  const welcomTextEl = document.getElementById('welcomText');
  const btnSignInEl = document.getElementById('btnSignIn');
  const btnSignOutEl = document.getElementById('btnSignOut');
  if (user) {
    welcomTextEl.innerHTML = `Welcome ${user.displayName}`;
    btnSignInEl.style.display = 'none';
    btnSignOutEl.style.display = '';
  } else {
    welcomTextEl.innerHTML = `You're not logged in`;
    btnSignInEl.style.display = '';
    btnSignOutEl.style.display = 'none';
  }
}

function onNewBeerAdded(beer) {
  const beerHtmlRow = `
        <li class="mdl-list__item" row-beer-key="${beer.key}">
          <div class="flex-1">
            <span role="text">${beer.name}</span>
            <input type="text" role="input" value="${
              beer.name
            }" style="display: none" class="mdl-textfield__input" />
          </div>
          <span>
            <button type="button" onclick="onClickEditBtn('${
              beer.key
            }')" role="editBtn" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
              <i class="material-icons">edit</i>
            </button>
            <button type="button" onclick="onClickSaveBtn('${
              beer.key
            }')" style="display: none" role="saveBtn" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
              <i class="material-icons">save</i>
            </button>
          </span>
          <span>
            <button type="button" onclick="onClickDeleteBtn('${
              beer.key
            }')" role="deleteBtn" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
            <i class="material-icons">delete</i>
          </button>
          </span>
        </li>`;

  const beersListElement = document.querySelector('#beersList');
  beersListElement
    .querySelector('li:last-child')
    .insertAdjacentHTML('afterend', beerHtmlRow);
}

function onBeerUpdated(beer) {
  const { text } = getHtmlElements(beer.key);
  text.innerHTML = beer.name
}

function onBeerDeleted(beerKey) {
  const beerRowElement = document.querySelector(
    `#beersList li[row-beer-key='${beerKey}']`
  );
  beerRowElement.parentElement.removeChild(beerRowElement);
}

function removeOnLoadingElement() {
  const loadElement = document.getElementById('load');
  loadElement.innerHTML = '';
}


function onClickEditBtn(beerKey) {
  const { input, text, editBtn, saveBtn } = getHtmlElements(beerKey);
  input.value = text.innerHTML
  input.style['display'] = '';
  text.style['display'] = 'none';
  editBtn.style['display'] = 'none';
  saveBtn.style['display'] = '';
}

function onClickSaveBtn(beerKey) {
  const { input, text, editBtn, saveBtn } = getHtmlElements(beerKey);
  input.style['display'] = 'none';
  text.style['display'] = '';
  editBtn.style['display'] = '';
  saveBtn.style['display'] = 'none';

  updateBeer({
    key: beerKey,
    name: input.value,
  });
}

function onClickDeleteBtn(beerKey) {
  deleteBeer(beerKey);
}

function onClickAddBtn() {
  const input = document.querySelector(`[role='inputNew']`);
  if (input.value === '') {
    return;
  }
  addNewBeer({
    name: input.value,
  });
  input.value = '';
}

function getHtmlElements(index) {
  const row = document.querySelector(
    `#beersList [row-beer-key='${index}']`
  );
  const input = row.querySelector(`[role='input']`);
  const text = row.querySelector(`[role='text']`);
  const editBtn = row.querySelector(`[role='editBtn']`);
  const saveBtn = row.querySelector(`[role='saveBtn']`);
  return {
    input,
    text,
    editBtn,
    saveBtn,
  };
}
