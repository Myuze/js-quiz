// Quiz Page Elements
var timerEl = document.getElementById('timer');
var highScoreEl = document.getElementById('high-score');
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
  
      var formattedTime = timer.formatTimer(timer.currentTimeLeft);
      
      timerEl.textContent = `Time: ${formattedTime}`;
  
      // Stop the timer and go to the end screen afte time runs out
      if(timer.currentTimeLeft < 1) {
        timer.endTimer();
        main.endScreen();
      }
  
    }, 1000);
  },

  subtractTime: function() {
    this.currentTimeLeft -= this.secToSubtract;
  },

  endTimer: function() {
    clearInterval(this.timerInterval);
  },

  delay: function(seconds, func) {
    var milliseconds = seconds * 1000;
    setTimeout(function() {
      func();
    }, milliseconds);
  }
}

// Question Generator Object
var questionsGenerator = {
  currentQuestion: {},

  // Array of Question dictionaries
  questions: [

    // Dictionaries of question and answers
    {
      question: 'What does the "O" JSON stand for?',
      answer: "Object",
      wAnswer: [
        "Online",
        "Obfuscation",
        "Optical"
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
      question: "What what cannot be used to change font-size?",
      answer: "fr",
      wAnswer: [
        "em",
        "rem",
        "px",
      ]
    },

    {
      question: "What is NOT a property of a background?",
      answer: "background-action",
      wAnswer: [
        "margin",
        "color",
        "background-size",
      ]
    },

    {
      question: "Commonly used data types DO NOT include:",
      answer: "alerts",
      wAnswer: [
        "strings",
         "booleans",
          "numbers"
      ]
    },

    {
      question: "The condition in an if / else statement is enclosed within ____.",
      answer: "parentheses",
      wAnswer: [
        "quotes",
        "curly brackets",
        "square brackets"
      ]
    },

    {
      question: "Arrays in JavaScript can be used to store ____.",
      answer: "all of the above",
      wAnswer: [
        "numbers and strings",
        "other arrays",
        "booleans"
      ],
    },

    {
      question: "String values must be enclosed within ____ when being assigned to variables.",
      answer: "quotes",
      wAnswer: [
        "commas",
        "curly brackets",
        "parentheses"
      ]
    },

    {
      question: "A very useful tool used during development and debugging for printing content to the debugger is:",
      answer: "console.log",
      wAnswer: [
        "JavaScript",
        "terminal / bash",
        "for loops"
      ]
    }
  ],

  // Create answer list elements then shuffle
  createAnswerList: function() {
    var ansList = [];

    Object.entries(this.currentQuestion).forEach(entry => {
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

  getNextQuestion: function() {
    questionsGenerator.clearAnswers();
    if (this.getRandomQuestions()) {
      questEl.textContent = this.currentQuestion['question'];
      this.createAnswerList();
      
    } else {
      main.endScreen();
    };
  },

  getRandomQuestions: function() {
    var randQ = this.questions.splice(Math.floor(Math.random() * this.questions.length), 1);

    if (randQ[0]) {
      this.currentQuestion = randQ[0];
      return true;

    } else {
      return false;
    }
  },

  // Verify answer, if the answer is correct add score and -5 seconds if wrong
  verifyAnswer: function(ansTarget) {
    if (ansTarget.textContent === this.currentQuestion['answer']) {
      score.addScore();
      answerTitle.textContent = "CORRECT!!!";

    } else {
      timer.subtractTime();
      answerTitle.textContent = `WRONG!!! -${timer.secToSubtract}sec`;
    }

    this.getNextQuestion();
    
    // Delay clearing of Correct and Wrong notifications
    timer.delay(2, questionsGenerator.clearAnsTitle);
    
  },

  clearQuestAns: function() {
    questEl.textContent = "";
    answerListEl.remove();
  },

  clearAnsTitle: function() {
    answerTitle.textContent = "";
  },

  clearAnswers: function() {
    while (answerListEl.firstChild) {
      answerListEl.removeChild(answerListEl.firstChild);
    }
  }
}

// Score Object to track and store scores
var score = {
  qValue: 10, // Point value of questions

  showScoreScreen: function() {
    answerTitle.textContent = `Your Score Was: ${player['score']}`;
    score.createForm();
  },

  addScore: function() {
    player['score'] += this.qValue;
  },

  resetScore: function() {
    player.score = 0;
  },

  recordInitials: function() {
    
  },

  createForm: function() {
    var submitForm = document.createElement('form');
    var initalInput = document.createElement('input');
    var submitBtn = document.createElement('button');
    var playerData = player.getData();
    submitBtn.textContent = 'SUBMIT';
    initalInput.setAttribute('type', 'text');
    initalInput.setAttribute('placeholder', 'Enter Initials');
    submitForm.appendChild(initalInput);
    submitForm.appendChild(submitBtn);
    answerContainer.appendChild(submitForm);

    submitBtn.addEventListener('click', function() {
      player.playerName = initalInput.value;
      console.log(initalInput.value)
      localStorage.setItem('player', JSON.stringify(playerData));
      });
    },

  viewScoreScreen: function() {
    score.recordInitials();
  }
}

var player = {
  playerName: "",
  score: 0,

  getData: function() {
    return player;
  },
}

// Main Program Object
var main = {
  // Starting Page
  startScreen: function() {
    var startButton = document.createElement('button');
    startButton.classList.add('start');
    startButton.textContent = 'START QUIZ';
    questEl.appendChild(startButton);
    startButton.addEventListener('click', this.gameStart);
    highScoreEl.addEventListener('click', score.viewScoreScreen);
  },

  // Initalize game start, and generate questions
  gameStart: function() {
    timer.initTimer();
    timer.startTimer();

    questionsGenerator.clearAnsTitle();

    answerListEl.addEventListener('click', function(e) {
      questionsGenerator.verifyAnswer(e.target);
    });

    questionsGenerator.getNextQuestion();
  },

  // End of quiz flow, record high scores
  endScreen: function() {
    questionsGenerator.clearQuestAns();
    timer.endTimer();
    questEl.textContent = "QUIZ OVER!!!";
    timer.delay(3, score.showScoreScreen);
  },
}

main.startScreen();


