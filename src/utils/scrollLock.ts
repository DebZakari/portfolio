export function lockScroll() {
  const bar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (bar > 0) document.body.style.paddingRight = `${bar}px`;
}

export function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}
