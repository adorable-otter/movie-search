import { snakeToCamelObj } from './util.js';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTQ4MjNlNGVkODg2YWM5OWRjZTEwMjFkYzdlZTM4ZSIsIm5iZiI6MTcyOTI1NDI1MS44MTAyNjgsInN1YiI6IjY3MGRjN2YzNDJlMTM5MWM1NjY2ZTEyNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EI-deX0U7aB2UXPklRundrtCYx3ZbR4qr7TZ8s1IRm8',
  },
};

const requestDataList = async (url) => {
  const response = await fetch(url, options);
  let results = [];
  if (response.ok) {
    results = (await response.json()).results;
  } else {
    alert('데이터를 가져오는데 실패했습니다.');
  }
  return results.map(snakeToCamelObj);
};

const requestData = async (url) => {
  const response = await fetch(url, options);
  let result = {};
  if (response.ok) {
    result = await response.json();
  } else {
    alert('데이터를 가져오는데 실패했습니다.');
  }
  return snakeToCamelObj(result);
};

export { requestData, requestDataList };
