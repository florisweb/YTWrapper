
function setTextToElement(element, text) {
  element.innerHTML = "";
  let a = document.createElement('a');
  a.text = text;
  element.append(a);
}

function newId() {
  return Math.round(Math.random() * 100000000) + "" + Math.round(Math.random() * 100000000);
}

function $(_string) {
  return document.querySelectorAll(_string);
}