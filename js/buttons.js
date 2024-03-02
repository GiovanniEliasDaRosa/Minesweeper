const body = document.body;
const mapElement = document.querySelector("#map");
const configElement = document.querySelector("#config");

const config = document.querySelector("#config");
const startNewButton = document.querySelector("#startNewButton");
const finishButton = document.querySelector("#finishButton");

const startNewMenu = document.querySelector("#startNewMenu");
const openStartNewMenu = document.querySelector("#openStartNewMenu");
const closeStartNewMenu = document.querySelector("#closeStartNewMenu");

const finishGameMenu = document.querySelector("#finishGameMenu");
const closeFinishGame = document.querySelector("#closeFinishGame");

const finishGameMenu__title = document.querySelector("#finishGameMenu__title");
const bombsText = document.querySelector("#bombsText");
const flagsText = document.querySelector("#flagsText");
const correctFlagsText = document.querySelector("#correctFlagsText");
const extraFlagsText = document.querySelector("#extraFlagsText");
const pointsText = document.querySelector("#pointsText");

const quickStartNews = document.querySelectorAll(".quickStart");

const mapSize = document.querySelector("#mapSize");
const widthInput = document.querySelector("#widthInput");
const heightInput = document.querySelector("#heightInput");

mapElement.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

startNewButton.addEventListener("click", () => {
  StartNewGame();
  Disable(startNewMenu, true, true);
});

[...quickStartNews].forEach((quickStart) => {
  quickStart.addEventListener("click", () => {
    if (died) {
      StartNewGame();
      Disable(startNewMenu, true, true);
      return;
    }

    let confirmReset = confirm(Phrases[languageNum][2]);
    if (confirmReset) {
      StartNewGame();
      Disable(startNewMenu, true, true);
    }
  });
});

finishButton.addEventListener("click", () => {
  CheckEndGame(true);
  finishGameMenu.focus();
});

openStartNewMenu.addEventListener("click", () => {
  Enable(startNewMenu);
  closeStartNewMenu.focus();
});

closeStartNewMenu.addEventListener("click", () => {
  Disable(startNewMenu, true, true);
  openStartNewMenu.focus();
});

widthInput.addEventListener("input", () => {
  width = Clamp(widthInput.value, 8, 30);
  UpdateMapSize();
});

widthInput.addEventListener("blur", () => {
  width = Clamp(widthInput.value, 8, 30);
  widthInput.value = width;
  UpdateMapSize();
});

heightInput.addEventListener("input", () => {
  height = Clamp(heightInput.value, 8, 30);
  UpdateMapSize();
});

heightInput.addEventListener("blur", () => {
  height = Clamp(heightInput.value, 8, 30);
  heightInput.value = height;
  UpdateMapSize();
});

function UpdateMapSize() {
  mapSize.innerHTML = `${width} x ${height} = ${width * height}`;
}

closeFinishGame.addEventListener("click", () => {
  Disable(finishGameMenu, true, true);
  openStartNewMenu.focus();
});

mapElement.addEventListener("keydown", (e) => {
  let nextDirection = {
    x: 0,
    y: 0,
  };
  let flag = false;

  switch (e.code) {
    case "ArrowRight":
      nextDirection.y = 1;
      break;
    case "ArrowLeft":
      nextDirection.y = -1;
      break;
    case "ArrowUp":
      nextDirection.x = -1;
      break;
    case "ArrowDown":
      nextDirection.x = 1;
      break;
    case "ControlLeft":
      HelpAround();
      break;
    case "KeyF":
      flag = true;
      // document.querySelector(`[data-x='${lastSelected.x}'][data-y='${lastSelected.y}']`).focus();
      break;
    default:
      return;
  }

  let selected = document.querySelector(":focus");

  let x = Wrap(Number(selected.dataset.x) + nextDirection.x, 0, width - 1);
  let y = Wrap(Number(selected.dataset.y) + nextDirection.y, 0, height - 1);

  if (selected.id == "map") {
    x = 0;
    y = 0;
  }

  let next = document.querySelector(`[data-x='${x}'][data-y='${y}']`);

  if (next != null) {
    next.focus();
  }
  if (flag) {
    Flag(next, x, y);
  }
});

configElement.addEventListener("keydown", (e) => {
  let direction = 0;
  switch (e.code) {
    case "ArrowRight":
      direction = 1;
      break;
    case "ArrowLeft":
      direction = -1;
      break;
    default:
      return;
  }

  let selected = configElement.querySelector(":focus");

  let x = Wrap(Number(selected.dataset.pos) + direction, 0, 3);

  configElement.children[x].focus();
});

const ToolTip = document.querySelector("#ToolTip");
const closeToolTip = document.querySelector("#closeToolTip");

let firstTime = localStorage.getItem("firstTime");
if (firstTime == null) {
  window.addEventListener("resize", UpdateToolTip);

  setTimeout(() => {
    UpdateToolTip();
  }, 10);
}

function UpdateToolTip() {
  ToolTip.style = "display: grid";
  var buttonBound = openConfigMenu.getBoundingClientRect();
  var toolTipBound = ToolTip.getBoundingClientRect();

  let x = buttonBound.x + buttonBound.width / 2 - toolTipBound.width / 2;
  let y = buttonBound.y - toolTipBound.height;
  ToolTip.style = `left: ${x}px; top: calc(${y}px - 1em); display: grid;`;
}

closeToolTip.addEventListener("click", () => {
  ToolTip.style.display = "";
  window.removeEventListener("resize", null);
  localStorage.setItem("firstTime", "true");
  window.removeEventListener("resize", UpdateToolTip);
});

// A
var mouseX = null;
var mouseY = null;

document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mouseenter", onMouseUpdate, false);

function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function HelpAround() {
  let center = document.elementFromPoint(mouseX, mouseY);
  let centerX = Number(center.dataset.x);
  let centerY = Number(center.dataset.y);

  if (center.tagName == "DIV") {
    let mapBound = mapElement.getBoundingClientRect();
    let itemBound = mapElement.children[0].getBoundingClientRect();

    centerX = Math.floor((mouseY - mapBound.y) / itemBound.height);
    centerY = Math.floor((mouseX - mapBound.x) / itemBound.width);
  }

  // document.querySelector(`[data-x='${centerX}'][data-y='${centerY}']`).classList.toggle("help");

  for (let xPos = -1; xPos < 2; xPos++) {
    for (let yPos = -1; yPos < 2; yPos++) {
      let markX = centerX + xPos;
      let markY = centerY + yPos;
      if (InsideColumns(markX) && InsideRows(markY)) {
        document.querySelector(`[data-x='${markX}'][data-y='${markY}']`).classList.toggle("help");
      }
    }
  }
}
