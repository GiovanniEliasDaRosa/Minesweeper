let animating = "";

function InsideColumns(num) {
  return num >= 0 && num < width;
}

function InsideRows(num) {
  return num >= 0 && num < height;
}

function Random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function Wrap(number, min, max) {
  let result = number;
  if (number > max) {
    result = min;
  } else if (number < min) {
    result = max;
  }
  return result;
}

function Enable(element) {
  element.removeAttribute("disabled");
  element.removeAttribute("aria-disabled");
  element.style.display = "";
}

function Disable(element, hide = true, animate = false) {
  element.setAttribute("disabled", "");
  element.setAttribute("aria-disabled", "true");
  if (animate) {
    clearTimeout(animating);
    animating = setTimeout(() => {
      element.style.display = "none";
    }, 500);
    return;
  }

  element.setAttribute("disabled", "");
  element.setAttribute("aria-disabled", "true");

  if (hide) {
    element.style.display = "none";
  }
}
