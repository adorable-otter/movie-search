import { getScrollbarWidth } from './util.js';
import { bookmarks } from './bookmark.js';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p';

const toggleModal = () => {
  const $modal = document.querySelector('[data-name=movie-detail]');
  const $dialog = document.querySelector('[data-name=dialog]');
  const body = document.body.style;
  $modal.classList.toggle('hidden');
  $dialog.scrollTop = 0;
  if ($modal.classList.contains('hidden')) {
    // body의 스크롤 바를 보여준다.
    body.paddingRight = '';
    body.overflow = 'auto';
  } else {
    // body의 스크롤 바를 숨긴다.
    body.paddingRight = getScrollbarWidth();
    body.overflow = 'hidden';
  }
};

const createMovieCard = ({ title, id, voteAverage, posterPath }) => {
  const imgSize = '/w200';
  const li = document.createElement('li');
  li.classList.add('card');
  li.setAttribute('data-id', id);

  const cardImg = document.createElement('div');
  cardImg.classList.add('card__img');
  cardImg.style.backgroundImage = `url(${IMG_BASE_URL + imgSize + posterPath})`;

  const cardTitle = document.createElement('span');
  cardTitle.classList.add('card__title');
  cardTitle.textContent = title;

  const cardRating = document.createElement('span');
  cardRating.classList.add('card__rating');
  cardRating.textContent = voteAverage.toFixed(1);

  li.appendChild(cardImg);
  li.appendChild(cardTitle);
  li.appendChild(cardRating);
  return li;
};

const setModalData = ({ posterPath, overview, releaseDate, voteAverage, id, title }) => {
  const imgSize = '/w500';
  const $detailImg = document.querySelector('[data-name=detail-img');
  const $title = document.querySelector('[data-name=detail-title');
  const $overview = document.querySelector('[data-name=overview');
  const $releaseDate = document.querySelector('[data-name=release-date');
  const $voteAverage = document.querySelector('[data-name=detail-rating');
  const $selectedMovieId = document.querySelector('[data-selected-movie-id');
  const [year, month, day] = releaseDate.split('-');

  $detailImg.style.backgroundImage = `url(${IMG_BASE_URL + imgSize + posterPath})`;
  $overview.textContent = overview;
  $releaseDate.textContent = `${year}년 ${Number(month)}월 ${Number(day)}일`;
  $voteAverage.textContent = voteAverage.toFixed(1);
  $selectedMovieId.textContent = id;
  $title.textContent = title;
};

const initBookmarkBtn = (movieId) => {
  const $bookmarkBtn = document.querySelector('[data-name=bookmark]');
  const $confirm = document.querySelector('[data-name=confirm]');
  $bookmarkBtn.classList.remove('hidden');
  $confirm.classList.add('hidden');
  if (bookmarks.contains(movieId)) {
    $bookmarkBtn.classList.add('bookmark_marked');
  } else {
    $bookmarkBtn.classList.remove('bookmark_marked');
  }
};

export { toggleModal, createMovieCard, setModalData, initBookmarkBtn };
