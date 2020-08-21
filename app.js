'use strict';

function initSapperGame() {
  const size = 10;
  const squareSize = 50;

  let bombs = [];
  let numbers = [];
  const numberColors = ['#f68741', '#fcdf87', '#ef0195', '#1b96f3', '#10133a'];
  const message = {
    lose: 'Ты пидор!',
    win: 'Ты не пидор! Поздравляю!'
  };

  const bombFrequency = 0.2;

  let gameOver = false;

  const sapper = document.querySelector('.sapper');

  function createField() {

    for (let i = 0; i < size ** 2; i++) {
      const square = document.createElement('div');

      square.classList.add('square');
      square.style.width = squareSize + 'px';
      square.style.height = squareSize + 'px';

      sapper.appendChild(square);
    }

    const fields = document.querySelectorAll('.square');

    sapper.style.width = size * squareSize + 'px';

    let x = 0;
    let y = 0;

    fields.forEach(square => {
      square.dataset.square = `${x},${y}`;

      let randomBoolean = Math.random() < bombFrequency;

      if (randomBoolean) {
        bombs.push(`${x},${y}`);

        if (x > 0) {
          numbers.push(`${x-1},${y}`);
        }

        if (x < size - 1) {
          numbers.push(`${x+1},${y}`);
        }

        if (y > 0) {
          numbers.push(`${x},${y-1}`);
        }

        if (y < size - 1) {
          numbers.push(`${x},${y+1}`);
        }

        if (x > 0 && y > 0) {
          numbers.push(`${x-1},${y-1}`);
        }

        if (x < size - 1 && y < size - 1) {
          numbers.push(`${x+1},${y+1}`);
        }

        if (y > 0 && x < size - 1) {
          numbers.push(`${x+1},${y-1}`);
        }
        if (x > 0 && y < size - 1) {
          numbers.push(`${x-1},${y+1}`);
        }
      }

      x++;
      if (x >= size) {
        x = 0;
        y++;
      }

      square.addEventListener('click', event => {
        const target = event.currentTarget;

        clickOnSquare(target);
      });

      square.addEventListener('contextmenu', event => {
        event.preventDefault();
        const target = event.currentTarget;

        addFlag(target);
      });
    });

    numbers.forEach(num => {
      const coords = num.split(',');
      const squareWhisNumber = document.querySelector(`[data-square="${+coords[0]},${+coords[1]}"]`);
      let dataNum = +squareWhisNumber.dataset.number;

      if (!dataNum) {
        dataNum = 0;
      } 
      squareWhisNumber.dataset.number = dataNum + 1;
    });


  }
  createField();

  function clickOnSquare(target) {
    if(gameOver) {
      return console.log('Game over');
    }

    const coords = target.dataset.square;
    const number = target.dataset.number;

    if(bombs.includes(coords) && numbers.includes(coords)) {
      target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      target.innerHTML = '&#128163';
      
      showPopup(message.lose);

      gameOver = true;
    }
    if(numbers.includes(coords)) {
      target.innerHTML = number;
      target.style.color = numberColors[number];
      target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    }
    if(!numbers.includes(coords)) {
      target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    }
  }

  function addFlag(target) {
    const coords = target.dataset.square;

    let flags = 0;

    if(bombs.includes(coords)) {
      flags++;
    }

    target.innerHTML = '&#128681';
    console.log(flags);

    isWin(flags);
  }

  function isWin(flags) {
    if(bombs.length === flags) {
      showPopup(message.win);
    }
  }

  function showPopup(message) {
    const popup = document.createElement('div');

    popup.classList.add('popup');
    popup.textContent = message;
    document.body.appendChild(popup);

  }

  function restartGame() {
    const popup = document.querySelector('popup');

    gameOver = false;
    bombs = [];
    numbers = [];
    document.body.innerHTML = '';

    document.body.removeChild(popup);

    createField();
  }

  // tests
  console.log(bombs);
  console.log(numbers);

}

initSapperGame();
