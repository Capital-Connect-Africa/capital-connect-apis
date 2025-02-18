const urlRegex =
  /^(https?:\/\/www\.|https?:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}(\/[^\s]*)?$/;

export const isValidURL = (url: string) => {
  return urlRegex.test(url);
};
