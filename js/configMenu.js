const openConfigMenu = document.querySelector("#openConfigMenu");
const configMenu = document.querySelector("#configMenu");
const closeConfigMenu = document.querySelector("#closeConfigMenu");

const changeLanguage = document.querySelector("#changeLanguage");

const Dictionary = [
  [
    ["startNewMenu__h1", "Configure o tamanho do mapa"],
    ["startNewMenu__p", "Defina um valor para a largura e altura do mapa, pode ser entre 8 até 30"],
    ["startNewMenu__width", "Largura"],
    ["startNewMenu__height", "Altura"],
    ["startNewButton", "Criar"],
    ["configMenu__h1", "Configurações"],
    ["configMenu__mode", "Modo"],
    ["configMenu__language", "Língua"],
    ["openStartNewMenu", "Começar um novo"],
    ["openConfigMenu", "Configurações"],
    ["finishButton", "Finalizar"],
    ["finishGameMenu__bombs", "Bombas"],
    ["finishGameMenu__flags", "Bandeiras"],
    ["finishGameMenu__correctFlags", "Bandeiras corretas"],
    ["finishGameMenu__extraFlags", "Bandeiras extras"],
    ["finishGameMenu__points", "Pontuação"],
    ["ToolTip__p", "Você consegue mudar o tema, língua e som aqui"],
    ["configMenu__sound", "Som"],
  ],
  [
    ["startNewMenu__h1", "Configure the map size"],
    [
      "startNewMenu__p",
      "Define values for the width and height of map, it can be between 8 and 30",
    ],
    ["startNewMenu__width", "Width"],
    ["startNewMenu__height", "Height"],
    ["startNewButton", "Create"],
    ["configMenu__h1", "Configurations"],
    ["configMenu__mode", "Mode"],
    ["configMenu__language", "Language"],
    ["openStartNewMenu", "Start new"],
    ["openConfigMenu", "Configurations"],
    ["finishButton", "Finish"],
    ["finishGameMenu__bombs", "Bombs"],
    ["finishGameMenu__flags", "Flags"],
    ["finishGameMenu__correctFlags", "Correct flags"],
    ["finishGameMenu__extraFlags", "Extra flags"],
    ["finishGameMenu__points", "Score"],
    ["ToolTip__p", "You can change the theme, language and sound here"],
    ["configMenu__sound", "Sound"],
  ],
  [
    ["startNewMenu__h1", "Configurer la taille de la carte"],
    [
      "startNewMenu__p",
      "Définissez une valeur pour la largeur et la hauteur de la carte, elle peut être comprise entre 8 et 30",
    ],
    ["startNewMenu__width", "Largeur"],
    ["startNewMenu__height", "Hauteur"],
    ["startNewButton", "Créer"],
    ["configMenu__h1", "Paramètres"],
    ["configMenu__mode", "Mode"],
    ["configMenu__language", "Langue"],
    ["openStartNewMenu", "Commencez-en un nouveau"],
    ["openConfigMenu", "Paramètres"],
    ["finishButton", "Fin"],
    ["finishGameMenu__bombs", "Bombes"],
    ["finishGameMenu__flags", "Drapeaux"],
    ["finishGameMenu__correctFlags", "Drapeaux corrects"],
    ["finishGameMenu__extraFlags", "Drapeaux supplémentaires"],
    ["finishGameMenu__points", "Ponctuation"],
    ["ToolTip__p", "Vous pouvez changer le thème, la langue et le son ici"],
    ["configMenu__sound", "Son"],
  ],
];

const Phrases = [
  [
    "Que pena você perdeu",
    "Parabéns você ganhou!",
    "Você quer realmente começar de novo?",
    "Modo escuro",
    "Modo azul escuro",
    "Modo claro",
    "Modo azul claro",
  ],
  [
    "What a pitty you lost",
    "Congratulations you won!",
    "Do you really want to star over?",
    "Dark mode",
    "Dark blue mode",
    "Light mode",
    "Light blue mode",
  ],
  [
    "Dommage que vous l’avez manqué",
    "Félicitations, vous avez gagné !",
    "Voulez-vous vraiment recommencer à zéro ?",
    "Mode foncé",
    "Mode bleu foncé",
    "Mode clair",
    "Mode bleu clair",
  ],
];

const changeMode = document.querySelector("#changeMode");
const changeSound = document.querySelector("#changeSound");

var languageNum = 0;
var language = window.navigator.userLanguage || window.navigator.language;
var nextOption = "en";
var animateSwitch = false;
var selectedColor = "light";
var soundOn = true;

var colorSchemeSelected = 3;
var nextSelectColor = "dark";
var animatingSwitch = "";

changeMode.addEventListener("click", () => {
  selectedColor = nextSelectColor;

  switch (nextSelectColor) {
    case "dark":
      colorSchemeSelected = 3;
      nextSelectColor = "darkBlue";
      break;
    case "darkBlue":
      colorSchemeSelected = 4;
      nextSelectColor = "light";
      break;
    case "light":
      colorSchemeSelected = 5;
      nextSelectColor = "lightBlue";
      break;
    case "lightBlue":
      colorSchemeSelected = 6;

      nextSelectColor = "dark";
      break;
  }

  changeMode.innerHTML = Phrases[languageNum][colorSchemeSelected];
  localStorage.setItem("mode", selectedColor);

  if (selectedColor == "darkBlue" || selectedColor == "dark") {
    changeMode.classList.remove("light");
  } else {
    changeMode.classList.add("light");
  }

  document.body.setAttribute("data-color", selectedColor);

  if (animateSwitch) {
    document.body.style = "transition: all 1s ease-out";
    clearTimeout(animatingSwitch);
    animatingSwitch = setTimeout(() => {
      document.body.style = "";
    }, 1000);
  }
});

changeSound.addEventListener("click", () => {
  if (soundOn) {
    soundOn = false;
    changeSound.classList.add("soundMute");
  } else {
    soundOn = true;
    changeSound.classList.remove("soundMute");
  }
  localStorage.setItem("soundOn", soundOn);
});

changeLanguage.addEventListener("click", () => {
  if (nextOption == "pt-BR") {
    changeLanguage.innerHTML = "Português";
    document.title = "Campo minado";
    languageNum = 0;

    language = "pt-BR";
    nextOption = "fr";
  } else if (nextOption == "fr") {
    languageNum = 2;
    changeLanguage.innerHTML = "Français";
    document.title = "Champ de mines";

    language = "fr";
    nextOption = "en";
  } else {
    changeLanguage.innerHTML = "English";
    document.title = "Minesweeper";

    languageNum = 1;

    language = "en";
    nextOption = "pt-BR";
  }

  localStorage.setItem("language", language);
  changeMode.innerHTML = Phrases[languageNum][colorSchemeSelected];

  let lang = Dictionary[languageNum];
  for (let i = 0; i < lang.length; i++) {
    const element = lang[i];
    document.querySelector(`#${element[0]}`).innerHTML = element[1];
  }
});

let languageSaved = localStorage.getItem("language");

if (languageSaved != null) {
  language = languageSaved;
  nextOption = languageSaved;
} else {
  if (language == "fr" || language == "pt-BR") {
    nextOption = language;
  } else {
    language = "en";
  }
}
changeLanguage.click();

/* if user prefers dark change to dark */

let modeSaved = localStorage.getItem("mode");

if (modeSaved != null) {
  selectedColor = modeSaved;
  nextSelectColor = modeSaved;
} else {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    nextSelectColor = "dark";
  }
}
changeMode.click();
animateSwitch = true;

let soundOnSaved = localStorage.getItem("soundOn");

if (soundOnSaved != null) {
  if (soundOnSaved == "false") {
    changeSound.click();
  }
}

Disable(configMenu);

openConfigMenu.addEventListener("click", () => {
  Enable(configMenu);
  closeConfigMenu.focus();
});

closeConfigMenu.addEventListener("click", () => {
  Disable(configMenu, true, true);
  openConfigMenu.focus();
});

var configMenu__divs = document.querySelectorAll(".configMenu__div");

configMenu__divs.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    if (e.srcElement.tagName == "BUTTON") {
      return;
    }
    elem.querySelector(`#${elem.dataset.for}`).click();
  });
});
