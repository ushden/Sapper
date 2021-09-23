'use strict';

function initSapperGame() {

  let bombs = [];
  let numbers = [];
  const numberColors = ['#000000', '#785C07', '#ef0195', '#1b96f3', '#10133a'];

  const message = {
    lose: 'Вы проиграли!',
    win: 'Поздравляю, победа!',
    flag: 'Максимальное количество флагов!'
  };

  const newGameBtn = document.querySelector('.settings button'); 

  // Настройка игры
  let settings = {
    size: 5,
    bombFrequency: 0.2
  };

  const fieldSize = document.querySelector('#size');
  const complexity = document.querySelector('#complexity');

  fieldSize.addEventListener('input', () => {
    let value = +fieldSize.value;

    if (value >= 2 && value <= 20) {
      newGameBtn.disabled = false;
    } else {
      newGameBtn.disabled = true;
    }

    settings.size = value;
  });

  complexity.addEventListener('change', () => {
    let value = complexity.value;

    if (value === 'easy') {
      settings.bombFrequency = 0.1;
    }

    if (value === 'middle') {
      settings.bombFrequency = 0.5;
    }

    if (value === 'hard') {
      settings.bombFrequency = 1;
    }
    console.log(settings.size, settings.bombFrequency);
  });

  let flags = 0;
  let flagOnBomb = 0;

  let gameOver = false;

  // Выводим количество бомб и флагов
  function showInfo() {
    const bombCount = document.querySelector('.settings .bomb-count span');
    const flagCount = document.querySelector('.settings .flag-count span');

    bombCount.innerHTML = bombs.length;
    flagCount.innerHTML = flags;
  }


  const sapper = document.querySelector('.sapper');
  const width = sapper.getBoundingClientRect().width;

  // Создание игрового поля со всеми даными (Бомбы, цифры, пустые поля)
  function createField() {

    for (let i = 0; i < settings.size ** 2; i++) {
      const square = document.createElement('div');

      square.classList.add('square');
      square.style.width = width / settings.size + 'px';
      square.style.height = width / settings.size + 'px';

      sapper.appendChild(square);
    }

    const fields = document.querySelectorAll('.square');

    let x = 0;
    let y = 0;

    fields.forEach(square => {
      square.dataset.square = `${x},${y}`;

      let randomBoolean = Math.random() < settings.bombFrequency;

      if (randomBoolean && !numbers.includes(`${x},${y}`)) {
        bombs.push(`${x},${y}`);

        if (x > 0) {
          numbers.push(`${x-1},${y}`);
        }

        if (x < settings.size - 1) {
          numbers.push(`${x+1},${y}`);
        }

        if (y > 0) {
          numbers.push(`${x},${y-1}`);
        }

        if (y < settings.size - 1) {
          numbers.push(`${x},${y+1}`);
        }

        if (x > 0 && y > 0) {
          numbers.push(`${x-1},${y-1}`);
        }

        if (x < settings.size - 1 && y < settings.size - 1) {
          numbers.push(`${x+1},${y+1}`);
        }

        if (y > 0 && x < settings.size - 1) {
          numbers.push(`${x+1},${y-1}`);
        }
        if (x > 0 && y < settings.size - 1) {
          numbers.push(`${x-1},${y+1}`);
        }
      }

      x++;
      if (x >= settings.size) {
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

        if (!target.textContent) {
          addFlag(target);
        } else {
          removeFlag(target);
        }

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

    showInfo();
  }

  // Обработка клика по клетке
  function clickOnSquare(target) {
    if (gameOver) {
      return console.log('Game over');
    }

    const coords = target.dataset.square;
    const number = target.dataset.number;

    if (target.textContent === '🚩') {
      --flags;
      showInfo();
    }

    if (bombs.includes(coords) && !numbers.includes(coords)) {
      target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      target.innerHTML = '&#128163';

      showPopup(message.lose);

      gameOver = true;

      return;
    }

    if (numbers.includes(coords) && !bombs.includes(coords)) {
      target.innerHTML = number;
      target.style.color = numberColors[number];
      target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';

      return;
    }

    if (!numbers.includes(coords) && !bombs.includes(coords) && !number) {
      target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      checkSquare(coords);

      return;
    }

  }

  // Открытие пустых квадратиков, если нету циферок
  function checkSquare(coordinate) {
    let coords = coordinate.split(',');
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);

    setTimeout(() => {
      if (x > 0) {
        let targetW = document.querySelector(`[data-square="${x-1},${y}"`);
        clickOnSquare(targetW);
      }
      if (x < settings.size - 1) {
        let targetE = document.querySelector(`[data-square="${x+1},${y}"`);
        clickOnSquare(targetE);
      }
      if (y > 0) {
        let targetN = document.querySelector(`[data-square="${x},${y-1}"]`);
        clickOnSquare(targetN);
      }
      if (y < settings.size - 1) {
        let targetS = document.querySelector(`[data-square="${x},${y+1}"]`);
        clickOnSquare(targetS);
      }

      if (x > 0 && y > 0) {
        let targetNW = document.querySelector(`[data-square="${x-1},${y-1}"`);
        clickOnSquare(targetNW);
      }
      if (x < settings.size - 1 && y < settings.size - 1) {
        let targetSE = document.querySelector(`[data-square="${x+1},${y+1}"`);
        clickOnSquare(targetSE);
      }

      if (y > 0 && x < settings.size - 1) {
        let targetNE = document.querySelector(`[data-square="${x+1},${y-1}"]`);
        clickOnSquare(targetNE);
      }
      if (x > 0 && y < settings.size - 1) {
        let targetSW = document.querySelector(`[data-square="${x-1},${y+1}"`);
        clickOnSquare(targetSW);
      }
    }, 10);
  }

  // Поставить флаг на правую кнопку мыши или долгое нажатие на смартфоне
  function addFlag(target) {
    const coords = target.dataset.square;

    if (flags >= bombs.length) {
      return showPopup(message.flag);
    }

    target.innerHTML = '&#128681';

    if (bombs.includes(coords)) {
      flagOnBomb += 1;
      console.log(flagOnBomb);
    }

    flags++;

    isWin(flagOnBomb);
    showInfo();
  }

  // Удалить флаг
  function removeFlag(target) {
    target.innerHTML = '';
    --flags;
    showInfo();
  }

  // Проверка на победу
  function isWin(flags) {
    if (bombs.length === flags) {
      showPopup(message.win);
    }
  }

  // Показать сообщение о победе или проиграше
  function showPopup(text) {
    const popup = document.createElement('div');

    if (popup.classList.contains('hide')) {
      popup.classList.remove('hide');
    }

    popup.classList.add('popup');
    popup.textContent = text;
    document.body.appendChild(popup);

    if (popup.textContent) {
      setTimeout(() => {
        popup.classList.add('hide');
      }, 2500);
    }
  }

  newGameBtn.addEventListener('click', event => {
    event.preventDefault();

    // alert('Пока не работате, обнови страничку, пидр');
    restartGame();
  });

  function restartGame() {
    sapper.innerHTML = '';

    gameOver = false;
    bombs = [];
    numbers = [];

    fieldSize.value = '';
    newGameBtn.disabled = true;

    createField();
  }

  // tests
}

initSapperGame();
