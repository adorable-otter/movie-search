import { snakeToCamelObj } from './util.js';

document.addEventListener('DOMContentLoaded', () => {
  showPopMovieList();
});

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ',
  },
};

const IMG_BASE_URL = 'https://image.tmdb.org/t/p';

const showPopMovieList = async () => {
  const $cardList = document.querySelector('ul');
  let response;
  try {
    response = await fetch(
      'https://api.themoviedb.org/3/movie/popular?language=ko&page=1',
      options
    );
  } catch (err) {
    alert('데이터를 가져오는데 실패했습니다.');
  }
  const json = await response.json();
  json.results.forEach((result) => {
    $cardList.appendChild(createMovieCard(snakeToCamelObj(result)));
  });
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
