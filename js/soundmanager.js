function PlaySound(name) {
  let audio = document.querySelector(`[data-audio='${name}']`);

  if (audio.dataset.playing != null) {
    audio = document.querySelector(`[data-alt-audio='${name}']`);

    if (audio.dataset.playing != null) {
      return;
    }
  }

  audio.currentTime = 0;
  audio.play();
  audio.setAttribute("data-playing", "true");
  setTimeout(() => {
    audio.removeAttribute("data-playing");
  }, 100);
}

function PlayExplosive() {
  if (!soundOn) {
    return;
  }
  PlaySound(`explosion_${Random(1, 3)}`);
}
