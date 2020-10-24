import './styles.css';
import { default as fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import liTemplateByName from './template/li-names.hbs';
import liTemplateByItem from './template/li-template.hbs';

const refs = {
  input: document.getElementById('js-input'),
  list: document.getElementById('js-list'),
};

const addItemsHtml = item => {
  refs.list.innerHTML = '';
  refs.list.insertAdjacentHTML('afterbegin', item);
};

const drawList = data => {
  const dataLength = data.length;
  if (data.length > 10) {
    refs.list.innerHTML = '';
    error({
      text: 'Too many matches found. Please enter a more specific query',
      hide: false,
      sticker: false,
      click: function () {
        error.remove();
      },
    });
  } else if (data.length >= 2 && dataLength <= 10) {
    const item = liTemplateByName(data);
    addItemsHtml(item);
  } else if (data.length === 1) {
    const item = liTemplateByItem(data);
    addItemsHtml(item);
  }
};

const getDataWithDebounce = debounce(function (i) {
  const allData = fetchCountries(i);
  allData.then(data => drawList(data));
}, 500);

const checkInput = ev => {
  const inputLength = ev.target.value.length;
  if (inputLength) {
    getDataWithDebounce(ev.target.value);
  }
};

refs.input.addEventListener('input', checkInput);
