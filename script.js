import { snakeToCamelObj } from './util.js';
import { requestData, requestDataList } from './request.js';
import { toggleModal, createMovieCard, setModalData } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const $movieList = document.querySelector('ul');
  const $backDrop = document.querySelector('[data-name=movie-detail]');
  $movieList.addEventListener('click', showMovieDetail);
  $backDrop.addEventListener('click', handleBackDropClick);
  document.forms.search.addEventListener('submit', handleSearchFormSubmit);
  showPopMovieList();
});

const showPopMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const url = 'https://api.themoviedb.org/3/movie/popular?language=ko&page=1';
  const results = await requestDataList(url);
  results?.forEach((result) => {
    $cardList.appendChild(createMovieCard(snakeToCamelObj(result)));
  });
};

const handleBackDropClick = (e) => {
  if (e.target === e.currentTarget || e.target.dataset.name === 'dialog-close') toggleModal();
};

const handleSearchFormSubmit = (e) => {
  e.preventDefault();
  showSearchedMovieList();
};

const showMovieDetail = async (e) => {
  const movieId = e.target.closest('li').dataset.id;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=ko`;
  const result = await requestData(url);
  setModalData(snakeToCamelObj(result));
  toggleModal();
};

const showSearchedMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const searchKey = document.querySelector('[name=searchKey]').value;
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchKey}&include_adult=false&language=ko&page=1`;
  const results = await requestDataList(url);
  $cardList.replaceChildren();
  results?.forEach((result) => {
    $cardList.appendChild(createMovieCard(snakeToCamelObj(result)));
  });
};
