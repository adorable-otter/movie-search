import { requestData, requestDataList } from './request.js';
import { toggleModal, createMovieCard, setModalData, initBookmarkBtn } from './ui.js';
import { bookmarks } from './bookmark.js';

let selectedMovie;

document.addEventListener('DOMContentLoaded', () => {
  addEventListeners();
  navigate(location.pathname);
});

const navigate = (pathName) => {
  const paths = {
    '/': showPopMovieList,
    '/bookmarks': showBookmarkList,
    '/popMovies': showPopMovieList,
    '/search': showSearchedMovieList,
  };
  if (pathName === '/' || location.pathname !== pathName) {
    history.pushState({ pathName }, null, location.origin + pathName);
  }
  paths[pathName]();
};

const addEventListeners = () => {
  const $movieList = document.querySelector('ul');
  const $backDrop = document.querySelector('[data-name=movie-detail]');
  const $showBookmarkBtn = document.querySelector('[data-name=show-bookmarks]');
  const $confirm = document.querySelector('[data-name=confirm]');
  const $bookmark = document.querySelector('[data-name=bookmark]');
  $movieList.addEventListener('click', showMovieDetail);
  $backDrop.addEventListener('click', handleModalClick);
  document.forms.search.addEventListener('submit', handleSearchFormSubmit);
  $showBookmarkBtn.addEventListener('click', () => navigate('/bookmarks'));
  $confirm.addEventListener('click', handleConfirmClick);
  $bookmark.addEventListener('click', handleBookmarkClick);
  window.addEventListener('popstate', (e) => navigate(e.state.pathName));
};

const handleModalClick = (e) => {
  if (e.target === e.currentTarget || e.target.dataset.name === 'dialog-close') {
    toggleModal();
  }
};

const handleBookmarkClick = (e) => {
  const $confirm = document.querySelector('[data-name=confirm]');
  if (bookmarks.contains(selectedMovie.id)) {
    e.currentTarget.classList.add('hidden');
    $confirm.classList.remove('hidden');
  } else {
    bookmark(selectedMovie);
    initBookmarkBtn(selectedMovie.id);
  }
};

const handleConfirmClick = (e) => {
  if (e.target.dataset.name === 'delete') {
    bookmarks.delete(selectedMovie.id);
    initBookmarkBtn(selectedMovie.id);
  } else if (e.target.dataset.name === 'cancel') {
    initBookmarkBtn(selectedMovie.id);
  }
};

const handleSearchFormSubmit = (e) => {
  e.preventDefault();
  navigate('/search');
};

const showPopMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const url = 'https://api.themoviedb.org/3/movie/popular?language=ko&page=1';
  const results = await requestDataList(url);
  $cardList.replaceChildren();
  results?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
};

const showMovieDetail = async (e) => {
  if (e.target === e.currentTarget) return;
  const movieId = e.target.closest('li').dataset.id;
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=ko`;
  selectedMovie = await requestData(url);
  setModalData(selectedMovie);
  toggleModal();
  initBookmarkBtn(movieId);
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
  const results = bookmarks.getContents();
  $cardList.replaceChildren();
  Object.values(results)?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
};

const bookmark = ({ posterPath, overview, releaseDate, voteAverage, id, title }) => {
  bookmarks.add({ posterPath, overview, releaseDate, voteAverage, id, title });
};
