import { requestData, requestDataList } from './request.js';
import { toggleModal, createMovieCard, setModalData, initBookmarkBtn } from './ui.js';
import { bookmarks } from './bookmark.js';

let selectedMovie;

document.addEventListener('DOMContentLoaded', () => {
  addEventListeners();
  navigate(location.pathname, {});
});

const route = (path) => {
  const paths = {
    '/': showPopMovieList,
    '/bookmarks': showBookmarkList,
    '/popMovies': showPopMovieList,
    '/search': showSearchedMovieList,
  };
  return paths[path];
};

const navigate = (pathToMove, data = {}) => {
  if (location.pathname === pathToMove) {
    history.replaceState({ pathToMove, data }, null, location.origin + pathToMove);
  } else {
    history.pushState({ pathToMove, data }, null, location.origin + pathToMove);
  }
  initPage(pathToMove);
  route(pathToMove)(data);
};

const initPage = (pathName) => {
  const $cardList = document.querySelector('ul');
  const $searchInput = document.querySelector('[name=searchKey]');
  if (pathName !== '/search') {
    $searchInput.value = '';
  }
  pageSelector.init();
  $cardList.replaceChildren();
};

const addEventListeners = () => {
  const $movieList = document.querySelector('ul');
  const $backDrop = document.querySelector('[data-name=movie-detail]');
  const $showBookmarkBtn = document.querySelector('[data-name=show-bookmarks]');
  const $confirm = document.querySelector('[data-name=confirm]');
  const $bookmark = document.querySelector('[data-name=bookmark]');
  const $searchInput = document.querySelector('[name=searchKey]');
  window.addEventListener('popstate', (e) => navigate(e.state.pathToMove, e.state.data));
  document.forms.search.addEventListener('submit', debounce(handleSearchEvent, 400));
  $movieList.addEventListener('click', showMovieDetail);
  $backDrop.addEventListener('click', handleModalClick);
  $showBookmarkBtn.addEventListener('click', () => navigate('/bookmarks'));
  $confirm.addEventListener('click', handleConfirmClick);
  $bookmark.addEventListener('click', handleBookmarkClick);
  $searchInput.addEventListener('input', debounce(handleSearchEvent, 400));
};

// 이벤트가 발생하면 timeout 뒤에 콜백을 실행한다.
// timeout 사이에 이벤트가 발생한다면 기존 타이머를 삭제하고 새 타이머를 시작한다.
const debounce = (callback, timeout) => {
  let timer;
  return (e) => {
    e && e.preventDefault();
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, timeout, e);
  };
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

const handleSearchEvent = () => {
  const searchKey = document.querySelector('[name=searchKey]').value;
  navigate('/search', { searchKey });
};

const showPopMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const url = `https://api.themoviedb.org/3/movie/popular?language=ko&page=${pageSelector.next()}}`;
  const results = await requestDataList(url);
  results?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
  $cardList.lastChild && observer.observe($cardList.lastChild);
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

const showSearchedMovieList = async (data) => {
  const $cardList = document.querySelector('ul');
  const searchKey = data.searchKey ? data.searchKey : '';
  document.querySelector('[name=searchKey]').value = searchKey;
  const url = `https://api.themoviedb.org/3/search/movie?query=${searchKey}&include_adult=false&language=ko&page=${pageSelector.next()}`;
  const results = await requestDataList(url);
  results?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
  $cardList.lastChild && observer.observe($cardList.lastChild);
};

const showBookmarkList = () => {
  const $cardList = document.querySelector('ul');
  const results = bookmarks.getContents();
  Object.values(results)?.forEach((result) => $cardList.appendChild(createMovieCard(result)));
};

const bookmark = ({ posterPath, overview, releaseDate, voteAverage, id, title }) => {
  bookmarks.add({ posterPath, overview, releaseDate, voteAverage, id, title });
};

const observer = new IntersectionObserver(
  (entries, observer) => {
    const searchKey = document.querySelector('[name=searchKey]').value;
    const entry = entries[0];
    if (entry.isIntersecting) {
      route(location.pathname)({ searchKey });
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.8 }
);

const pageSelector = (() => {
  let page = 0;
  return {
    next() {
      return ++page;
    },
    init() {
      page = 0;
    },
  };
})();
