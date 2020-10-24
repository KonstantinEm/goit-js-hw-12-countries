'use strict';
import countrySearch from './services/country-service';
import refs from './refs';
import articlesOneCountry from '../templates/templatesOneCountry.hbs';
import countryList from '../templates/templatesManyCountry.hbs';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
// const { error } = require('@pnotify/core/dist/PNotify.js');
let debounce = require('lodash.debounce');

refs.searchForm.addEventListener(
  'input',
  debounce(countrySearchInputHandler, 500),
);

function countrySearchInputHandler(e) {
  e.preventDefault();
  clearArticlesContainer();
  const searchQuery = e.target.value;

  countrySearch
    .fetchArticles(searchQuery)
    .then(data => {
      if (data.length > 10) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      } else if (data.status === 404) {
        error({
          text:
            'No country has been found. Please enter a more specific query!',
        });
      } else if (data.length === 1) {
        buildListMarkup(data, articlesOneCountry);
      } else if (data.length <= 10) {
        buildListMarkup(data, countryList);
      }
    })
    .catch(Error => {
      error({
        text: 'You must enter query parameters!',
      });
      console.log(Error);
    });
}

function buildListMarkup(countryes, template) {
  const markup = countryes.map(count => template(count)).join();
  refs.articlesContainer.insertAdjacentHTML('afterbegin', markup);
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}
