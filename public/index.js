document.addEventListener('DOMContentLoaded', function() {
  try {
    watchAllBeers(onReceiveBeersUpdate);
  } catch (e) {
    console.error(e);
    document.getElementById('load').innerHTML =
      'Error loading the Firebase SDK, check the console.';
  }
});

function onReceiveBeersUpdate(beers) {
  removeOnLoadingElement();
  buildHtmlBeersArray(beers);
}

function removeOnLoadingElement() {
  const loadElement = document.getElementById('load');
  loadElement.innerHTML = '';
}

function buildHtmlBeersArray(beers) {
  let beersHtmlRows = '';
  beers.forEach(beer => {
    beersHtmlRows += `
        <tr row-beer-key="${beer.key}">
          <td>
            <span role="text">${beer.name}</span>
            <input type="text" role="input" value="${
              beer.name
            }" style="display: none" />
          </td>
          <td>
            <button type="button" onclick="onClickEditBtn('${
              beer.key
            }')" role="editBtn">Edit</button>
            <button type="button" onclick="onClickSaveBtn('${
              beer.key
            }')" style="display: none" role="saveBtn">Save</button>
          </td>
          <td>
            <button type="button" onclick="onClickDeleteBtn('${
              beer.key
            }')" role="deleteBtn">Delete</button>
          </td>
        </tr>`;
  });

  const beersTableElement = document.querySelector('#beersContainer table');
  const rows = beersTableElement.querySelectorAll('tr[row-beer-key]');
  const p = beersTableElement.querySelector('tr').parentElement;
  (rows || []).forEach(trElement => p.removeChild(trElement));
  beersTableElement
    .querySelector('tr')
    .insertAdjacentHTML('afterend', beersHtmlRows);
}

function onClickEditBtn(beerKey) {
  const { input, text, editBtn, saveBtn } = getHtmlElements(beerKey);
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
    `#beersContainer [row-beer-key='${index}']`
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
