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
      ansItem.classList.add('ans');
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
    ui.clearAnswers();
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
    timer.delay(2, ui.clearAnsTitle);
    
  }
}

// Score Object to track and store scores
var score = {
  qValue: 10, // Point value of questions
  highScoreList: [], 

  showScoreScreen: function() {
    ui.createShowScoreScreen();
  },

  addScore: function() {
    player['score'] += this.qValue;
  },

  addPlayer: function() {
    this.highScoreList.push(player);
  },

  getCurrentScores: function() {
    if (localStorage.getItem('highScoreList')) {
      console.log(localStorage.getItem('highScoreList'))
      this.highScoreList = JSON.parse(localStorage.getItem('highScoreList'));
      this.highScoreList.forEach(player => {
        var playerEl = document.createElement('li');
        playerEl.classList.add('player');
        playerEl.textContent = `${player.playerName} score: ${player.score}`;
        answerTitle.appendChild(playerEl);
      });
    } else {
      answerTitle.textContent = 'No High Scores'
    }
  },

  storeHighScores: function() {
    this.highScoreList.push(player);
    console.log(this.highScoreList)

    if (localStorage.getItem('highScoreList')) {
      var existingScore = localStorage.getItem('highScoreList');
      this.highScoreList.concat(existingScore);
    }
    localStorage.setItem('highScoreList', JSON.stringify(this.highScoreList));
  },

  resetHighScoreList: function() {
    this.highScoreList = [];
    localStorage.setItem('highScoreList', JSON.stringify(this.highScoreList));
    ui.clearPlayers();
    answerTitle.textContent = 'No High Scores'
  },

  resetScore: function() {
    player.score = 0;
  },

  viewScoreScreen: function() {
    ui.createHighscoreScreen();
    score.getCurrentScores();

  },

  clearHighScores: function() {
    localStorage.setItem('highScoreList', {});
    ui.clearPlayers();
  }
}

var player = {
  playerName: "",
  score: 0,

  getData: function() {
    return player;
  },
}

var ui = {
  currentScreen: '',

  createStartScreen: function() {
    if (this.currentScreen == 'startScreen') {
      return;

    } else {
      this.clearQuestAns();
      score.getCurrentScores();
      var startButton = document.createElement('button');
      startButton.classList.add('start');
      startButton.textContent = 'START QUIZ';
      questEl.appendChild(startButton);
      answerTitle.textContent = "Answer as many questions as possible within 2 minutes."
      startButton.addEventListener('click', main.gameStart);
      highScoreEl.addEventListener('click', score.viewScoreScreen);

      this.currentScreen = 'startScreen'
    }

  },

  createHighscoreScreen: function() {
    if (this.currentScreen == 'highScoreScreen') {
      return;

    } else {
      ui.clearSubmitButton();
      timer.endTimer();
      answerTitle.textContent = "Current Highscores:"
      
      // Create Go Back and Reset Buttons
      var backBtn = document.createElement('button');
      var resetBtn = document.createElement('button');
  
      backBtn.classList.add('back-btn');
      backBtn.textContent = 'BACK';
      answerContainer.appendChild(backBtn);

      resetBtn.classList.add('reset-btn');
      resetBtn.textContent = 'CLEAR HIGHSCORES';
      answerContainer.appendChild(resetBtn);
      
      backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        main.startScreen();
      });

      resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        score.resetHighScoreList();
        ui.clearResetButton();
      });

      this.currentScreen = 'highScoreScreen'
    }
  },

  createShowScoreScreen: function() {
    if (this.currentScreen == 'showScoreScreen') {
      return;

    } else {
      ui.clearQuestAns();
      ui.clearBackButton();
      var submitForm = document.createElement('form');
      var initalInput = document.createElement('input');
      var submitBtn = document.createElement('button');
      
      // Build Inital Input and Submit button
      answerTitle.textContent = `Your Score Was: ${player['score']}`;
      initalInput.classList.add('submit');
      submitBtn.textContent = 'SUBMIT';
      submitBtn.classList.add('submit');
      initalInput.setAttribute('type', 'text');
      initalInput.setAttribute('placeholder', 'Enter Initials');
      submitForm.appendChild(initalInput);
      submitForm.appendChild(submitBtn);
      answerContainer.appendChild(submitForm);
  
      // Add Submit Button click listener
      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        player.playerName = initalInput.value;
        score.storeHighScores();
        score.viewScoreScreen();
        });

        this.currentScreen = 'showScoreScreen'
    }
  },

  clearQuestAns: function() {
    this.clearQuest();
    this.clearAnsTitle();
    this.clearAnswers();
    this.clearBackButton();
    this.clearResetButton();
  },

  clearQuest: function() {
    questEl.textContent = "";
  },

  clearAnsTitle: function() {
    answerTitle.textContent = "";
  },

  clearAnswers: function() {
    document.querySelectorAll('.ans').forEach(function(a){
      a.remove();
    });
  },

  clearPlayers: function() {
    document.querySelectorAll('.player').forEach(function(a){
      a.remove();
    });
  },

  clearSubmitButton: function() {
    document.querySelectorAll('.submit').forEach(function(a){
      a.remove();
    });
  },

  clearBackButton: function() {
    document.querySelectorAll('.back-btn').forEach(function(a){
      a.remove();
    });
  },

  clearResetButton: function() {
    document.querySelectorAll('.reset-btn').forEach(function(a){
      a.remove();
    });
  }
}

// Main Program Object
var main = {
  // Starting Page
  startScreen: function() {
    ui.createStartScreen();
  },

  // Initalize game start, and generate questions
  gameStart: function() {
    timer.initTimer();
    timer.startTimer();

    ui.clearAnsTitle();

    answerListEl.addEventListener('click', function(e) {
      questionsGenerator.verifyAnswer(e.target);
    });

    questionsGenerator.getNextQuestion();
  },

  // End of quiz flow, record high scores
  endScreen: function() {
    ui.clearQuestAns();
    timer.endTimer();
    questEl.textContent = "QUIZ OVER!!!";
    timer.delay(3, score.showScoreScreen);
  },
}

main.startScreen();


