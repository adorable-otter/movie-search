import { snakeToCamelObj } from './util.js';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const movieList = document.querySelector('ul');
  showPopMovieList();

  movieList.addEventListener('click', (e) => {
    showMovieDetail(e);
  });
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

const showMovieDetail = async (e) => {
  const $movieCard = e.target.closest('li');
  const $modal = document.querySelector('[data-name=movie-detail]');
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${$movieCard.dataset.id}?language=ko`,
    options
  );
  if (response.ok) {
    const result = await response.json();
    setModalData(snakeToCamelObj(result));
    $modal.classList.remove('hidden');
  } else {
    alert('데이터를 가져오는데 실패했습니다.');
  }
};

const setModalData = ({ posterPath, overview, releaseDate, voteAverage, id }) => {
  const imgSize = '/w200';
  const $detailImg = document.querySelector('[data-name=detail-img');
  const $overview = document.querySelector('[data-name=overview');
  const $releaseDate = document.querySelector('[data-name=release-date');
  const $voteAverage = document.querySelector('[data-name=detail-rating');
  const $selectedMovieId = document.querySelector('[data-selected-movie-id');

  $detailImg.style.backgroundImage = `url(${IMG_BASE_URL + imgSize + posterPath})`;
  $overview.textContent = overview;
  $releaseDate.textContent = releaseDate;
  $voteAverage.textContent = voteAverage;
  $selectedMovieId.textContent = id;
};

const createMovieCard = ({ title, id, voteAverage, posterPath }) => {
  const imgSize = '/w200';
  const li = document.createElement('li');
  li.classList.add('card');
  li.setAttribute('data-id', id);

  const cardImg = document.createElement('div');
  cardImg.classList.add('card__img');
  cardImg.style.backgroundImage = `url(${IMG_BASE_URL + imgSize + posterPath})`;

  const cardTitle = document.createElement('div');
  cardTitle.classList.add('card__title');
  cardTitle.textContent = title;

  const cardRating = document.createElement('div');
  cardRating.classList.add('card__rating');
  cardRating.textContent = voteAverage;

  li.appendChild(cardImg);
  li.appendChild(cardTitle);
  li.appendChild(cardRating);
  return li;
};
