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
  let beersHtmlArray = '<table>';
  beers.forEach((beer, beerId) => {
    beersHtmlArray += `<tr row-id="${beerId}">
          <td>
            <span role="text">${beer.name}</span>
            <input type="text" role="input" value="${
              beer.name
            }" style="display: none" /></td>
          <td>
            <button type="button" onclick="onClickEditBtn(${beerId})" role="editBtn">Edit</button>
            <button type="button" onclick="onClickSaveBtn(${beerId})" style="display: none" role="saveBtn">Save</button>
          </td>
          <td>
            <button type="button" onclick="onClickDeleteBtn(${beerId})" role="deleteBtn">Delete</button>
          </td>
        </tr>`;
  });
  beersHtmlArray += '</table>';

  const beersContainerElement = document.getElementById('beersContainer');
  beersContainerElement.innerHTML = beersHtmlArray;
}

function onClickEditBtn(beerId) {
  const { input, text, editBtn, saveBtn } = getHtmlElements(beerId);
  input.style['display'] = '';
  text.style['display'] = 'none';
  editBtn.style['display'] = 'none';
  saveBtn.style['display'] = '';
}

function onClickSaveBtn(beerId) {
  const { input, text, editBtn, saveBtn } = getHtmlElements(beerId);
  input.style['display'] = 'none';
  text.style['display'] = '';
  editBtn.style['display'] = '';
  saveBtn.style['display'] = 'none';

  updateBeer(beerId, {
    name: input.value,
  });
}

function onClickDeleteBtn(beerId) {
  deleteBeer(beerId);
}

function getHtmlElements(index) {
  const row = document.querySelector(`#beersContainer [row-id='${index}']`);
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
