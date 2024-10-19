import { snakeToCamelObj } from './util.js';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer ',
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
