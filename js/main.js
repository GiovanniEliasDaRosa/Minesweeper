var width = 9;
var height = 9;
var pos = 20;
var GameOver = false;

var map;
var mapExploded;
var mapExplored;
var resetting = false;

var bombs = 0;
var bombsleft = 0;
var flags = 0;
var flagsCorrect = 0;
var died = false;

var maxUncoverSpeed = 10;

var timer;

function StartNewGame() {
  flags = 0;
  flagsCorrect = 0;
  died = false;
  GameOver = false;
  resetting = true;
  Disable(mapElement, false);

  setTimeout(() => {
    resetting = false;
    Enable(mapElement);
  }, 500);

  if (width > height) {
    maxUncoverSpeed = width * 10;
  } else {
    maxUncoverSpeed = height * 10;
  }
  maxUncoverSpeed = Clamp(maxUncoverSpeed, 20, 300);
  pos = maxUncoverSpeed;

  Enable(finishButton);
  Disable(finishGameMenu);

  mapElement.innerHTML = "";
  mapElement.style = `grid-template-columns: repeat(${height}, auto); grid-template-rows: repeat(${width}, auto)`;

  map = new Array(width);
  mapExploded = new Array(width);
  mapExplored = new Array(width);

  for (let x = 0; x < width; x++) {
    map[x] = new Array(height);
    mapExploded[x] = new Array(height);
    mapExplored[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      map[x][y] = 0;
      CreateNewButton(x, y);
    }
  }

  let maxBombs = (width * height) / 10;
  let minBombs = maxBombs / 2;

  bombs = Random(maxBombs, minBombs);
  bombsleft = bombs;

  while (bombsleft > 0) {
    let x = Random(0, width - 1);
    let y = Random(0, height - 1);

    if (map[x][y] != "bomb") {
      if (x == 0 && y == 0) {
        continue;
      }
      map[x][y] = "bomb";
      // console.log(x, y, map[x][y]);

      bombsleft--;

      for (let xPos = -1; xPos < 2; xPos++) {
        for (let yPos = -1; yPos < 2; yPos++) {
          if (xPos == 0 && yPos == 0) {
            continue;
          }
          if (InsideColumns(x + xPos) && InsideRows(y + yPos)) {
            let markX = x + xPos;
            let markY = y + yPos;
            if (map[markX][markY] == "bomb") {
              continue;
            }
            map[markX][markY] = map[markX][markY] + 1;
          }
        }
      }
    }
  }

  // console.log(map);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      UpdateButton(document.querySelector(`button[data-x='${x}'][data-y='${y}']`), map[x][y]);
    }
  }

  if (config.getBoundingClientRect().width < 500 && window.innerWidth > 500) {
    config.setAttribute("data-stack", "");
  } else {
    config.removeAttribute("data-stack");
  }
}

Disable(startNewMenu);
StartNewGame();

function UpdateButton(button, param) {
  // param = type
  if (param == "bomb") {
    button.setAttribute("data-bomb", "");
    button.innerHTML = "💣";
  } else {
    if (param != 0) {
      button.innerHTML = param;
    }

    button.setAttribute("data-number", param);
  }
}

function CreateNewButton(x, y) {
  let button = document.createElement("button");
  button.setAttribute("data-x", x);
  button.setAttribute("data-y", y);
  button.setAttribute("tabindex", "-1");

  if (width > 25 || height > 25) {
    button.setAttribute("data-small", "");
  }

  button.setAttribute("onclick", `Clicked(this, ${x}, ${y})`);

  button.addEventListener("touchstart", () => {
    console.log("touchstart");
    clearTimeout(timer);
    timer = setTimeout(() => {
      Flag(button, x, y);
    }, 1000);
  });

  button.addEventListener("touchend", () => {
    console.log("touchend");
    if (timer) {
      clearTimeout(timer);
    }
  });

  button.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    Flag(button, x, y);
  });

  mapElement.appendChild(button);
}

function Clicked(button, x, y) {
  if (resetting) {
    return;
  }
  if (button.dataset.flagged == "") {
    return;
  }

  button.removeAttribute("onclick");
  button.setAttribute("data-clicked", "");
  // Disable(button, false);

  Uncover(x, y);
}

function Uncover(x, y) {
  // if (mapExplored[x][y] == null) {
  //   setTimeout(() => {
  //     CheckEndGame();
  //   }, 100);
  // }

  mapExplored[x][y] = 0;

  if (map[x][y] == "bomb") {
    died = true;
    UncoverAll(x, y);
    FinishGame();
    PlayExplosive();
    return;
  }

  // if we clicked a number don't reveal the neighbors
  if (map[x][y] != 0) {
    return;
  }

  for (let xPos = -1; xPos < 2; xPos++) {
    for (let yPos = -1; yPos < 2; yPos++) {
      let markX = x + xPos;
      let markY = y + yPos;
      if (InsideColumns(markX) && InsideRows(markY)) {
        if (map[markX][markY] == "bomb") {
          continue;
        }
        if (mapExplored[markX][markY] == null) {
          pos = maxUncoverSpeed;
          UncoverZeros(markX, markY);
        }
      }
    }
  }
}

function UncoverZeros(x, y) {
  if (mapExplored[x][y] != null) {
    return;
  }
  if (resetting) {
    return;
  }

  // else {
  //   setTimeout(() => {
  //     if (!GameOver) {
  //       CheckEndGame();
  //     }
  //   }, 100);
  // }
  mapExplored[x][y] = 0;

  let button = document.querySelector(`button[data-x='${x}'][data-y='${y}']`);
  button.removeAttribute("onclick");
  button.setAttribute("data-clicked", "");
  // Disable(button, false);

  if (map[x][y] != 0) {
    return;
  }

  pos = Clamp((pos += 1), 1, 100);
  let savedPos = pos;

  for (let xPos = -1; xPos < 2; xPos++) {
    for (let yPos = -1; yPos < 2; yPos++) {
      let markX = x + xPos;
      let markY = y + yPos;
      if (InsideColumns(markX) && InsideRows(markY)) {
        if (map[markX][markY] == "bomb") {
          continue;
        }
        setTimeout(() => {
          UncoverZeros(markX, markY);
        }, savedPos);
      }
    }
  }
}

function Flag(button, x, y) {
  if (mapExplored[x][y] == "flag") {
    button.removeAttribute("data-flagged", "");
    mapExplored[x][y] = null;
    // button.classList.remove("help");
  } else {
    mapExplored[x][y] = "flag";
    // button.classList.add("help");
    button.setAttribute("data-flagged", "");
  }
}

function UncoverAll(x, y) {
  if (mapExploded[x][y] != null) {
    return;
  }
  if (resetting) {
    return;
  }

  mapExploded[x][y] = "seen";

  let button = document.querySelector(`button[data-x='${x}'][data-y='${y}']`);
  button.removeAttribute("onclick");
  button.setAttribute("data-clicked", "");
  // Disable(button, false);

  if (map[x][y] == "bomb") {
    if (!died) {
      button.setAttribute("data-clicked-won", "");
    } else {
      PlayExplosive();
    }
  }

  if (pos > 20) {
    pos -= 1;
  }
  // let savedPos = pos;

  for (let xPos = -1; xPos < 2; xPos++) {
    for (let yPos = -1; yPos < 2; yPos++) {
      let markX = x + xPos;
      let markY = y + yPos;
      if (InsideColumns(markX) && InsideRows(markY)) {
        if (map[x][y] == "bomb") {
          setTimeout(() => {
            UncoverAll(markX, markY);
          }, pos);
        } else {
          setTimeout(() => {
            UncoverAll(markX, markY);
          }, 2);
        }
      }
    }
  }
}

function CheckEndGame(buttonclick = false) {
  let quant = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (mapExplored[x][y] == 0) {
        quant++;
      }
    }
  }

  if (buttonclick) {
    if (width * height - bombs == quant) {
      died = false;
    }

    GameOver = true;
    FinishGame(true);
    return;
  }

  if (width * height - bombs == quant) {
    died = false;

    GameOver = true;
    FinishGame();
  }
}

function FinishGame(buttonclick = false) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (mapExplored[x][y] == "flag") {
        flags++;
        if (map[x][y] == "bomb") {
          flagsCorrect++;
        }
      }
      // let button = document.querySelector(`button[data-x='${x}'][data-y='${y}']`);
      // if (map[x][y] != "bomb") {
      //   button.removeAttribute("onclick");
      //   button.setAttribute("data-clicked", "");
      // }
    }
  }

  Disable(finishButton, false);

  if (flags < bombs || flagsCorrect < bombs) {
    finishGameMenu__title.innerText = Phrases[languageNum][0];
    // if (language == "pt-br") {
    //   finishGameMenu__title.innerText = "Que pena você perdeu";
    // } else if (language == "fr") {
    //   finishGameMenu__title.innerText = "What a pitty you lost";
    // } else {
    //   finishGameMenu__title.innerText = "What a pitty you lost";
    // }
    died = true;
  } else {
    finishGameMenu__title.innerText = Phrases[languageNum][1];

    //   if (language == "pt-br") {
    //     finishGameMenu__title.innerText = "Parabéns você ganhou!";
    //   } else if (language == "fr") {
    //     finishGameMenu__title.innerText = "Congratulations you won!";
    //   } else {
    //     finishGameMenu__title.innerText = "Congratulations you won!";
    //   }
  }
  if (!died || buttonclick) {
    UncoverAll(0, 0);
  }
  bombsText.innerText = bombs;
  flagsText.innerText = flags;
  correctFlagsText.innerText = flagsCorrect;

  let extraFlags = flags - flagsCorrect;

  extraFlagsText.innerText = extraFlags;
  let totalPoints = flagsCorrect - extraFlags;

  if (totalPoints < 0) {
    totalPoints = 0;
  }

  pointsText.innerHTML = totalPoints;

  setTimeout(() => {
    Enable(finishGameMenu);
    closeFinishGame.focus();
  }, Clamp(width * height * 10, 1000, 5000));
}

function Cheat() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let button = document.querySelector(`button[data-x='${x}'][data-y='${y}']`);
      if (map[x][y] == "bomb") {
        Flag(button, x, y);
      } else {
        button.removeAttribute("onclick");
        button.setAttribute("data-clicked", "");
      }
    }
  }
}

function ClearWhite() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let button = document.querySelector(`button[data-x='${x}'][data-y='${y}']`);
      if (map[x][y] == 0) {
        button.removeAttribute("onclick");
        button.setAttribute("data-clicked", "");
      }
    }
  }
}
