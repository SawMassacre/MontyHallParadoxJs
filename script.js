const doors = [];
let state = "picked";
let pickedDoor;
let revealedDoor;
let switchButton, stayButton, playAgain;
let outcomeP;
let divider;

let resultsP; //может сделать несколькоо переменных.....

let totalSwitchPlays = 0;
let totalStayPlays = 0;

let totalSwitchWins = 0;
let totalStayWins = 0;

function startOver() {
  for (let door of doors) {
    door.prize = "🐐";
    door.html("");
    door.style("background-image", "url('door.png')");
  }
  const winner = random(doors);
  winner.prize = "🏎️";
  playAgain.hide();

  outcomeP.html("");
  state = "picked";
}

function setup() {
  for (let i = 0; i < 105; i++) { //кол во дверей
    doors[i] = createDiv(""); //пустой дивчик
    doors[i].parent("#doors");
    doors[i].class("door");
    doors[i].index = i;
    doors[i].mousePressed(pickDoor);
  }

  switchButton = createButton("Изменить выбор");
  switchButton.mousePressed(playerSwitch);
  switchButton.hide();

  divider = createDiv(""); //пробел между кнопками
  divider.class("divider");

  stayButton = createButton("Оставить выбор");
  stayButton.mousePressed(playerStay);
  stayButton.hide();

  playAgain = createButton("Играть заново");
  playAgain.mousePressed(startOver);
  playAgain.hide();

  resultsP = createP(""); //<p>шки для хтмл
  outcomeP = createP("");

  startOver();
}

function pickDoor() {
  if (state == "picked") {
    state = "reveal";
    pickedDoor = this;
    reveal();
  }
  //doorSound.play();
}

function reveal() {
  const options = [];
  //let theOnlyClosed;
  for (let i = 0; i < doors.length; i++) {
    const door = doors[i];
    if (i != pickedDoor.index && door.prize != "🏎️") {
      options.push(door);
    }
  }
  //theOnlyClosed = random(options);
  //for (let i = 0; i < options.length; i++) { //открыть все двери
    //if (options[i] != theOnlyClosed) {
      if (doors.length > 3) {
          if (pickedDoor.prize == "🏎️") {
            for (let j = 0; j < options.length - 1; j++) {
              revealedDoor = options[j]; 
              revealedDoor.style("background-image", "url('doorOpen.png')");
              revealedDoor.html(revealedDoor.prize);
            }
          } else {
            for (let j = 0; j < options.length; j++) {
              revealedDoor = options[j]; 
              revealedDoor.style("background-image", "url('doorOpen.png')");
              revealedDoor.html(revealedDoor.prize);
          }
        }
      } else {
          revealedDoor = random(options); 
          revealedDoor.style("background-image", "url('doorOpen.png')");
          revealedDoor.html(revealedDoor.prize);
      }
    //}
  //}

  switchButton.show();
  stayButton.show();
}

function playerSwitch() {
  totalSwitchPlays++;

  let newPick;
  for (let i = 0; i < doors.length; i++) {
    let door = doors[i];
    if (door != pickedDoor && door != revealedDoor) {
      newPick = door;
      break;
    }
  }
  pickedDoor = newPick;
  checkWin(true);
}

function playerStay() {
  totalStayPlays++;
  checkWin(false);
}

function checkWin(playerSwitch) {
  switchButton.hide();
  stayButton.hide();

  for (let door of doors) {
    door.html(door.prize);
    door.style("background-image", "url('doorOpen.png')");
  }

  if (pickedDoor.prize == "🏎️") {
    outcomeP.html("Вы угадали!");

    if (playerSwitch) {
      totalSwitchWins++;
    } else {
      totalStayWins++;
    }
  } else {
    outcomeP.html("Вы не угадали!"); //document.getElementById("myDiv").style.backgroundImage = "url('img_tree.png')";
  }

  let switchRate = totalSwitchWins / totalSwitchPlays;
  let stayRate = totalStayWins / totalStayPlays;

  if((isNaN(stayRate) == 1) || (isNaN(switchRate) == 1)) {
    resultsP.html(`Надо сыграть еще несколько раз!`);
  } else {
    resultsP.html(
      `Сменив выбор: ${totalSwitchPlays} <br/>
      Сменив и выиграв: ${totalSwitchWins} <br/>
      Сменив и проиграв: ${nf(totalSwitchPlays - totalSwitchWins)} <br/>
      Вероятность выиграть выбрав другую дверь: ${nf(100 * switchRate, 2, 2)} <br/>
      Оставшись на том же выборе: ${totalStayPlays} <br/>
      Оставшись и выиграв: ${totalStayWins} <br/>
      Оставшись и проиграв: ${nf(totalStayPlays - totalStayWins)} <br/>
      Вероятность выиграть оставив выбор: ${nf(100 * stayRate, 2, 2)}` //nf для стринга в инт
    );
  }

  playAgain.show();
}

//тут просто порофлим
let doorSound

function soundLoader() {
  doorSound = loadSound('doorSound.mp3');
}

function soundMaker() {
  doorSound.play();
}