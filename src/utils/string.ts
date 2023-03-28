export const containsPhrase = (text: string, pattern: string) => {
  const regExp = new RegExp(pattern, 'ig');

  return Array.isArray(text.match(regExp));
};

export const trim = (text: string, char: string) => {
  const regExp = new RegExp(`^\\${char}+|\\${char}+$`, 'ig');

  return text.replace(regExp, '');
};
