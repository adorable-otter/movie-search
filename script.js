import { snakeToCamelObj } from './util.js';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTQ4MjNlNGVkODg2YWM5OWRjZTEwMjFkYzdlZTM4ZSIsIm5iZiI6MTcyOTE0NDgyMi44OTc2NTQsInN1YiI6IjY3MGRjN2YzNDJlMTM5MWM1NjY2ZTEyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ae-fHFgd6y6JtDn7AeJVDcRzIFGcC72wC2JHBVyw0XE',
  },
};

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
  const response = await fetch(
    'https://api.themoviedb.org/3/movie/popular?language=ko&page=1',
    options
  );
  if (response.ok) {
    const results = (await response.json()).results;
    results?.forEach((result) => {
      $cardList.appendChild(createMovieCard(snakeToCamelObj(result)));
    });
  } else {
    alert('데이터를 가져오는데 실패했습니다.');
  }
};

const handleBackDropClick = (e) => {
  if (e.target === $backDrop || e.target.dataset.name === 'dialog-close') toggleModal();
};

const handleSearchFormSubmit = (e) => {
  e.preventDefault();
  showSearchedMovieList();
};

const showMovieDetail = async (e) => {
  const movieId = e.target.closest('li').dataset.id;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko`,
    options
  );
  if (response.ok) {
    const result = await response.json();
    setModalData(snakeToCamelObj(result));
    toggleModal();
  } else {
    alert('데이터를 가져오는데 실패했습니다.');
  }
};

const setModalData = ({ posterPath, overview, releaseDate, voteAverage, id, title }) => {
  const imgSize = '/w500';
  const $detailImg = document.querySelector('[data-name=detail-img');
  const $title = document.querySelector('[data-name=detail-title');
  const $overview = document.querySelector('[data-name=overview');
  const $releaseDate = document.querySelector('[data-name=release-date');
  const $voteAverage = document.querySelector('[data-name=detail-rating');
  const $selectedMovieId = document.querySelector('[data-selected-movie-id');

  $detailImg.style.backgroundImage = `url(${IMG_BASE_URL + imgSize + posterPath})`;
  $overview.textContent = overview;
  $releaseDate.textContent = releaseDate;
  $voteAverage.textContent = voteAverage;
  $selectedMovieId.textContent = id;
  $title.textContent = title;
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
  cardRating.textContent = voteAverage;

  li.appendChild(cardImg);
  li.appendChild(cardTitle);
  li.appendChild(cardRating);
  return li;
};

const showSearchedMovieList = async () => {
  const $cardList = document.querySelector('ul');
  const searchKey = document.querySelector('[name=searchKey]').value;
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${searchKey}&include_adult=false&language=ko&page=1`,
    options
  );
  if (response.ok) {
    const results = (await response.json()).results;
    $cardList.replaceChildren();
    results?.forEach((result) => {
      $cardList.appendChild(createMovieCard(snakeToCamelObj(result)));
    });
  } else {
    alert('데이터를 가져오는데 실패했습니다.');
  }
};

const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth + 'px';
};

const toggleModal = () => {
  const $modal = document.querySelector('[data-name=movie-detail]');
  const body = document.body.style;

  $modal.classList.toggle('hidden');
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
