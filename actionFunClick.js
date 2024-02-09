const winningScore = 100;
const things = [];
loopTimer = 100;
winRate = 0.9;
moveRate = 0.8;
loserLineVw = 92;

const updateScore = (delta) => {
  score = document.querySelector("#score");
  return (score.innerText = Math.min(
    winningScore,
    delta + Number.parseInt(score.innerText),
  ));
};

const resetScore = () => {
  document.querySelector("#score").innerText = 0;
};

const wobble = (n) => {
  r = Math.random() - 0.2;
  result = r > 0.3 ? n * r : 0;

  return Math.round(result);
};

const depress = (n) => () => {
  updateScore(wobble(n));
};

const loseFaster = (e, n) => {
  return () => {
    moveBy(e, n);
    updateScore(wobble(-n));
  };
};

const loop = () => {
  newScore = updateScore(wobble(winRate));

  things.forEach(move);

  if (newScore >= winningScore) {
    win();
  } else if (hasLost()) {
    lose();
  } else {
    timer = setTimeout(loop, loopTimer);
    setRestartButton(timer);
  }
};

const hasLost = () => {
  return things
    .map((t) => Number.parseInt(t.style.left))
    .some((n) => n >= loserLineVw);
};

const move = (thing) => moveBy(thing, wobble(moveRate));

const moveBy = (thing, n) => {
  Number.parseInt(thing.style.left) + "vw";
  const left = Math.max(0, n + Number.parseInt(thing.style.left)) + "vw";

  thing.style.left = left;
};

const start = () => {
  document.onmousemove = depress(-1);
  document.onclick = depress(-25);
  document.onkeydown = loseFasterIfWasd;

  things.forEach((thing, i) => {
    thing.onclick = loseFaster(thing, 17);
  });
  loop();
};
const win = () => setState("win", "you win.");
const lose = () => setState("lose", "***YOU LOSE!!!***");

const setState = (className, message) => {
  document.querySelector("h1").innerHTML = message;
  document.querySelector("body").classList = [className];
};

const setRestartButton = (timer) => {
  button = document.querySelector("button");
  button.innerText = "Restart";

  button.onclick = () => restartGame(timer);
};

const restartGame = (timer) => {
  clearTimeout(timer);

  button.innerText = "Start";
  button.onclick = start;

  document.onmousemove = null;
  document.onclick = null;
  document.onkeydown = null;

  things.forEach((thing, i) => {
    thing.onclick = null;
  });

  down = null;

  resetScore();

  setup();
};

const loseFasterIfWasd = (e) => {
  if (["w", "a", "s", "d"].includes(e.key)) {
    things.forEach((o) => {
      moveBy(o, 14);
      updateScore(wobble(-14));
    });
  } else if (e.key == "Z") {
    updateScore(500);
  }
};

const setup = () => {
  setState("start", "Click to win!");

  if (things.length == 0) {
    [...document.querySelectorAll(".thing")].forEach((thing) => {
      things.push(thing);
    });
  }

  things.forEach((thing) => {
    thing.style["margin"] = "2vh 1vw 2vh 1vw";
    thing.style.left = "1vw";
  });
};
