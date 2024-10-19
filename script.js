import { requestData, requestDataList } from './request.js';
import { toggleModal, createMovieCard, setModalData, toggleBookmarkBtn } from './ui.js';

let selectedMovie;

document.addEventListener('DOMContentLoaded', () => {
  addEventListeners();
  showPopMovieList();
});

const addEventListeners = () => {
  const $movieList = document.querySelector('ul');
  const $backDrop = document.querySelector('[data-name=movie-detail]');
  const $showBookmarkBtn = document.querySelector('[data-name=show-bookmarks]');
  $movieList.addEventListener('click', showMovieDetail);
  $backDrop.addEventListener('click', handleModalClick);
  document.forms.search.addEventListener('submit', handleSearchFormSubmit);
  $showBookmarkBtn.addEventListener('click', showBookmarkList);
};

const showPopMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const url = 'https://api.themoviedb.org/3/movie/popular?language=ko&page=1';
  const results = await requestDataList(url);
  results?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
};

const handleModalClick = (e) => {
  if (e.target === e.currentTarget || e.target.dataset.name === 'dialog-close') {
    toggleModal();
  } else if (e.target.dataset.name === 'bookmark') {
    bookmark(selectedMovie);
  } else if (e.target.dataset.name === 'del-bookmark') {
    deleteBookmark(selectedMovie.id);
  }
};

const handleSearchFormSubmit = (e) => {
  e.preventDefault();
  showSearchedMovieList();
};

const showMovieDetail = async (e) => {
  const movieId = e.target.closest('li').dataset.id;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=ko`;
  selectedMovie = await requestData(url);
  setModalData(selectedMovie);
  toggleModal();
  toggleBookmarkBtn(movieId);
};

const showSearchedMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const searchKey = document.querySelector('[name=searchKey]').value;
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchKey}&include_adult=false&language=ko&page=1`;
  const results = await requestDataList(url);
  $cardList.replaceChildren();
  results?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
};

const showBookmarkList = () => {
  const $cardList = document.querySelector('ul');
  const results = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  $cardList.replaceChildren();
  Object.values(results)?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
};

const bookmark = ({ posterPath, overview, releaseDate, voteAverage, id, title }) => {
  const movie = { posterPath, overview, releaseDate, voteAverage, id, title };
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  bookmarks[id] = movie;
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

const deleteBookmark = (movieId) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
  delete bookmarks[movieId];
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};
