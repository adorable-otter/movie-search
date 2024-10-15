const snakeToCamelObj = (obj) => {
  const convertedObject = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelCaseKey = snakeToCamel(key);
    convertedObject[camelCaseKey] = value;
  }

  return convertedObject;
};

const snakeToCamel = (str) => {
  const words = str.split("_");
  const camelCaseWord = words
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      const firstLetterCap = word.charAt(0).toUpperCase();
      const remainingLetters = word.slice(1);
      return firstLetterCap + remainingLetters;
    })
    .join("");

  return camelCaseWord;
};

export { snakeToCamel, snakeToCamelObj };
