export const createElement = (html: string) => {
  const placeholder = document.createElement('div');

  placeholder.innerHTML = html;

  return placeholder.firstElementChild;
};