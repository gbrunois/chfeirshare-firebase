const App = (function() {
  window.addEventListener('load', function() {
    document.getElementById('content').style.display = '';
    removeOnLoadingElement();
    try {
      Authentification.onAuthStateChanged(authStateChanged);
    } catch (e) {
      console.error(e);
      showToast(e.message);
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
    document
      .querySelectorAll('#beersList li[row-beer-key]')
      .forEach(beerRowElement =>
        beerRowElement.parentElement.removeChild(beerRowElement)
      );
    Database.watchBeers(onNewBeerAdded, onBeerUpdated, onBeerDeleted);
  }

  function onNewBeerAdded(beer) {
    const beerHtmlRow = `
        <li class="mdl-list__item" row-beer-key="${beer.key}">
          <div class="flex-1">
            <span role="text">${beer.name}</span>
            <span role="rate">${beer.rate ? beer.rate : '-'} / 5</span>
            <input type="text" role="input" value="${
              beer.name
            }" style="display: none" class="mdl-textfield__input" />
            ${Rating.buildStarsRating(beer.key, beer.userRate)}
          </div>
          <span>
            <button type="button" onclick="App.onClickEditBtn('${
              beer.key
            }')" role="editBtn" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
              <i class="material-icons">edit</i>
            </button>
            <button type="button" onclick="App.onClickSaveBtn('${
              beer.key
            }')" style="display: none" role="saveBtn" class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored">
              <i class="material-icons">save</i>
            </button>
          </span>
          <span>
            <button type="button" onclick="App.onClickDeleteBtn('${
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
    Rating.setStartsRatingEvents(beer.key, onUserRatingChanged);
  }

  function onUserRatingChanged(key, rateValue) {
    Database.rateABeer(key, rateValue);
  }

  function onBeerUpdated(beer) {
    const { text, rateText } = getHtmlElements(beer.key);
    if (beer.rate) {
      rateText.innerHTML = beer.rate;
    }
    text.innerHTML = beer.name;
  }

  function onBeerDeleted(beerKey) {
    const beerRowElement = document.querySelector(
      `#beersList li[row-beer-key='${beerKey}']`
    );
    beerRowElement.parentElement.removeChild(beerRowElement);
  }

  function removeOnLoadingElement() {
    const loadElement = document.getElementById('load');
    loadElement.style.display = 'none';
  }

  function onClickEditBtn(beerKey) {
    const { input, text, editBtn, saveBtn } = getHtmlElements(beerKey);
    input.value = text.innerHTML;
    input.style['display'] = '';
    text.style['display'] = 'none';
    editBtn.style['display'] = 'none';
    saveBtn.style['display'] = '';
  }

  function onClickSaveBtn(beerKey) {
    const { input, text, editBtn, saveBtn } = getHtmlElements(beerKey);
    const rate = Rating.getRateValue(beerKey);
    input.style['display'] = 'none';
    text.style['display'] = '';
    editBtn.style['display'] = '';
    saveBtn.style['display'] = 'none';

    Database.updateBeer({
      key: beerKey,
      name: input.value,
      rate,
    });
  }

  function onClickDeleteBtn(beerKey) {
    Database.deleteBeer(beerKey);
  }

  function onClickAddBtn() {
    const input = document.querySelector(`[role='inputNew']`);
    if (input.value === '') {
      return;
    }
    Database.addNewBeer({
      name: input.value,
    });
    input.value = '';
  }

  function getHtmlElements(index) {
    const row = document.querySelector(`#beersList [row-beer-key='${index}']`);
    const input = row.querySelector(`[role='input']`);
    const text = row.querySelector(`[role='text']`);
    const editBtn = row.querySelector(`[role='editBtn']`);
    const saveBtn = row.querySelector(`[role='saveBtn']`);
    const rateText = row.querySelector(`[role='rate']`);
    return {
      input,
      text,
      editBtn,
      saveBtn,
      rateText,
    };
  }

  function showToast(message) {
    var snackbarContainer = document.querySelector('#snackbar');
    var data = {
      message,
      timeout: 2000,
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }

  return {
    onClickAddBtn,
    onClickDeleteBtn,
    onClickSaveBtn,
    onClickEditBtn,
  };
})();
