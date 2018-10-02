const Rating = (function() {
  'use strict';

  function buildStarsRating(key, rateValue = 0) {
    let html = `<div class="stars-container" data-key="${key}" data-value="${rateValue}">`;
    for (let i = 1; i < 6; i++) {
      const cssClass =
        i <= rateValue ? 'rating-star-full' : 'rating-star-outline';
      html += `<div class="rating-star ${cssClass} material-icons" data-rating-val="${i}"></div>`;
    }
    html += `</div>`;
    return html;
  }

  function setStartsRatingEvents(key, onRateChanged) {
    Rating.onRateChanged = onRateChanged;
    const starsElements = getAllStartsElements(key);
    starsElements.forEach(el => el.addEventListener('mouseover', onmouseover));
    starsElements.forEach(el => el.addEventListener('mouseout', onmouseout));
    starsElements.forEach(el => el.addEventListener('click', onmouseclick));
  }

  function onmouseover(e) {
    const overRateValue = parseInt(
      e.srcElement.attributes['data-rating-val'].value,
      10
    );
    const key = e.srcElement.parentElement.attributes['data-key'].value;
    setRateValue(key, overRateValue);
  }

  function onmouseout(e, originalRateValue) {
    const key = e.srcElement.parentElement.attributes['data-key'].value;
    resetRateValue(key, originalRateValue);
  }

  function onmouseclick(e) {
    const containerElement = e.srcElement.parentElement;
    const rateValue = parseInt(
      e.srcElement.attributes['data-rating-val'].value,
      10
    );
    const key = containerElement.attributes['data-key'].value;
    setRateValue(key, rateValue, true);
    if (Rating.onRateChanged) {
      Rating.onRateChanged(key, rateValue);
    }
  }

  function setRateValue(key, rateValue, save = false) {
    const containerElement = document.querySelector(
      `.stars-container[data-key='${key}']`
    );
    if (save) {
      containerElement.attributes['data-value'].value = rateValue;
    }
    const starsElements = getAllStartsElements(key);
    starsElements.forEach(starElement => {
      const elementRateValue = parseInt(
        starElement.attributes['data-rating-val'].value,
        10
      );
      if (elementRateValue <= rateValue) {
        starElement.classList.replace(
          'rating-star-outline',
          'rating-star-full'
        );
      } else {
        starElement.classList.replace(
          'rating-star-full',
          'rating-star-outline'
        );
      }
    });
  }

  function getAllStartsElements(key) {
    const containerElement = document.querySelector(
      `.stars-container[data-key='${key}']`
    );
    return containerElement.querySelectorAll('.stars-container .rating-star');
  }

  function resetRateValue(key) {
    const containerElement = document.querySelector(
      `.stars-container[data-key='${key}']`
    );
    const originalRateValue = parseInt(
      containerElement.attributes['data-value'].value,
      10
    );
    const starsElements = getAllStartsElements(key);
    starsElements.forEach(starElement => {
      const rateValue = parseInt(
        starElement.attributes['data-rating-val'].value,
        10
      );
      if (rateValue > originalRateValue) {
        starElement.classList.replace(
          'rating-star-full',
          'rating-star-outline'
        );
      } else {
        starElement.classList.replace(
          'rating-star-outline',
          'rating-star-full'
        );
      }
    });
  }

  function getRateValue(key) {
    const containerElement = document.querySelector(
      `.stars-container[data-key='${key}']`
    );
    return parseInt(containerElement.attributes['data-value'].value, 10);
  }

  return {
    buildStarsRating,
    setStartsRatingEvents,
    getRateValue,
    setRateValue,
  };
})();
