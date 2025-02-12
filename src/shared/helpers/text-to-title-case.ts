export const textToTitlteCase = (text: string) => {
  return text
    .trim()
    .split(' ')
    .filter((word) => word)
    .map((word) => word.trim())
    .map(
      (word) =>
        `${word.at(0).toUpperCase().trim()}${word.slice(1).toLowerCase().trim()}`,
    )
    .join(' ')
    .trim();
};
