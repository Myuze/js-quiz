// When I select an answer the correct answer is highlighted green

// IF I select the wrong answer, the correct answer is highlighted green
// and the wrong answer turns red


// I can save my initials and score

// Quiz Page Elements
var timerEl = document.getElementById('timer');
var questEl = document.getElementById('question');
var answerContainer = document.getElementById('answer-container');
var answerTitle = document.getElementById('answer-title');
var answerListEl = document.getElementById('answer-list');

// Timer Object
var timer = {
  startTime: 120,
  currentTimeLeft: NaN,
  secToSubtract: 5,
  timerInterval: Object,

  // Display timer as "00:00" format
  formatTimer: function(timeInSeconds) {
    var min = '00';
    var sec = '00';

    if (timeInSeconds > 60) {
      min = Math.floor(timeInSeconds / 60);
      sec = Math.floor(timeInSeconds % 60);

    } else {
      min = '0';

      if (timeInSeconds < 1) {
        sec = '0';

      } else {
        sec = timeInSeconds;
      }
    }

    // Add leading zero to min or sec if less than 10
    if (min < 10) {
      min = `0${min}`;
    }

    if (sec < 10) {
      sec = `0${sec}`;
    }

    var time = `${min}:${sec}`;
    
    return time;
  },

  initTimer: function() {
    this.currentTimeLeft = this.startTime;
  },
  
  startTimer: function() {
    this.timerInterval = setInterval(function() {
      timer.currentTimeLeft--;
      console.log(timer.currentTimeLeft)
  
      var formattedTime = timer.formatTimer(timer.currentTimeLeft);
      
      timerEl.textContent = `Time: ${formattedTime}`;
  
      if(timer.currentTimeLeft < 1) {
        timer.endTimer();
  
        main.endScreen();
      }
  
    }, 1000);
  },

  subtractTime: function() {
    console.log('Time Subtracted')
    this.currentTimeLeft -= this.secToSubtract;
  },

  endTimer: function() {
    clearInterval(this.timerInterval);
  }
}

// Question Generator Object
var questionsGenerator = {

  // Array of Question dictionaries
  questions: [

    // Dictionaries of question and answers
    {
      question: "Which of the following is JSON most like?",
      answer: "Object",
      wAnswer: [
        "Dictionary",
        "Function",
        "Array"
      ],
    },
  
    {
      question: "Which is NOT a primitive type?",
      answer: "Object",
      wAnswer: [
        "String",
        "Number",
        "Bool",
      ]
    },

    {
      question: "What can be considered an integer?",
      answer: "Number",
      wAnswer: [
        "String",
        "Object",
        "Bool",
      ]
    },

    {
      question: "What what cannot be used to change font-size?",
      answer: "fr",
      wAnswer: [
        "em",
        "rem",
        "px",
      ]
    },

    {
      question: "What is not a property of a background",
      answer: "background-action",
      wAnswer: [
        "margin",
        "color",
        "background-size",
      ]
    }
  ],

  gameStart: function() {
    timer.initTimer();
    timer.startTimer();

    questionsGenerator.getRandomQuestions();
  },

  // Create answer list elements then shuffle
  createAnswerList: function(questionDict) {
    var ansList = [];

    Object.entries(questionDict).forEach(entry => {
      if (entry[0] == 'answer') {
        ansList.push(entry[1]);

      } else if (entry[0] == 'wAnswer') {
        entry[1].forEach(element => {
          ansList.push(element);
        });
      }
    })

    var shuffledAnswers = this.shuffleAnswers(ansList);
    
    shuffledAnswers.forEach(entry => {
      var ansItem = document.createElement('li');
      var ansText = document.createTextNode(entry);
      ansItem.appendChild(ansText);
      answerListEl.appendChild(ansItem);
    });
  },

  shuffleAnswers: function(array) {
    var currentIndex = array.length, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  },

  getRandomQuestions: function() {
    var randQ = this.questions.splice(Math.floor(Math.random() * this.questions.length), 1);

    if (randQ[0]) {
      questEl.textContent = randQ[0]['question'];
      this.createAnswerList(randQ[0]);
      answerEvents.addAnswerClickHandler(answerListEl, randQ[0]);

    } else {
      main.endScreen();
    }
  },

  clearQuestAns: function() {
    questEl.remove();
    answerListEl.remove();
  },

  clearAnswers: function() {
    while (answerListEl.firstChild) {
      answerListEl.removeChild(answerListEl.firstChild);
    }
  }
}

// Object to create event listeners to answers in list
var answerEvents = {
  addAnswerClickHandler: function(ansElem, question) {
    ansElem.addEventListener('click', function(e) {
      if (e.target.textContent === question['answer']) {
        score.addScore();
        questionsGenerator.clearAnswers();
        questionsGenerator.getRandomQuestions();
        answerTitle.textContent = "CORRECT!!!";

      } else {
        timer.subtractTime();
        answerTitle.textContent = `WRONG!!! -${timer.secToSubtract}sec`;
      }
    });
  }
}

// Score Object to track and store scores
var score = {
  qValue: 10,
  player: {
    playerInitials: "",
    playerScore: 0
  },

  show: function() {
    answerTitle.textContent = `Your Score Was: ${this.player['playerScore']}`;
  },

  addScore: function() {
    this.player['playerScore'] += this.qValue;
  },

  resetScore: function() {
    this.score = 0;
  },

  recordInitials: function() {
    this.createForm();
  },

  createForm: function() {
    var submitForm = document.createElement('form');
    var initInput = document.createElement('input');
    var submitBtn = document.createElement('button');
    var playerData = this.player;
    submitBtn.textContent = 'SUBMIT';
    submitForm.appendChild(initInput);
    submitForm.appendChild(submitBtn)
    answerContainer.appendChild(submitForm);

    submitBtn.addEventListener('click', function() {
      localStorage.setItem('player', JSON.stringify(playerData));
      });
    },

  viewScoreScreen: function() {
    this.recordInitials()
  }
}

// Main Program Object
var main = {
  // Starting Page
  startScreen: function() {
    var startButton = document.createElement('button');
    startButton.classList.add('start');
    startButton.textContent = 'START QUIZ';
    questEl.appendChild(startButton);
    startButton.addEventListener('click', questionsGenerator.gameStart);
  },


  endScreen: function() {
    timer.endTimer();
    answerTitle.textContent = "QUIZ OVER!!!";
    setTimeout(function() {
      questionsGenerator.clearQuestAns();
      score.show();
    }, 3000);
    score.recordInitials();
  },
}

main.startScreen();


