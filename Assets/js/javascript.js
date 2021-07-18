// Initialize with a dynamic start page with Start Button

// Click a button to start the quiz

// Timer starts counting down 

// Page Shows a random question with a list of answers DONE

// When I select an answer the correct answer is highlighted green
// and "Correct" appears at the bottom of the list"

// IF I select the wrong answer, the correct answer is highlighted green
// and the wrong answer turns red
// and "wrong" appears at the bottom of the list
// and time is subtracted from the clock

// After each answer I am presented with another question until the end of the quiz
// or time runs out

// Show Game Over at the end
// Show final score

// I can save my initials and score

// Quiz Page Elements
var timerEl = document.getElementById('timer');
var questEl = document.getElementById('question');
var answerContainer = document.getElementById('answer-container');
var answerListEl = document.getElementById('answer-list');

// Timer Object
var timer = {
  startTime: 180,
  secToSubtract: 5,

  // Display timer as "00:00" format
  formatTimer: function(timeInSeconds) {
    var min = '00';
    var sec = '00';

    if (timeInSeconds > 60) {
      min = Math.floor(timeInSeconds / 60);
      sec = Math.floor(timeInSeconds % 60);

    } else {
      min = '0'
      sec = timeInSeconds;
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
  
  startTimer: function() {
    var secondsRemaining = this.startTime; 

    var timerInterval = setInterval(function() {
      secondsRemaining--;

      var formattedTime = timer.formatTimer(secondsRemaining);
      
      timerEl.textContent = formattedTime;

      if(secondsRemaining < 1) {
        clearInterval(timerInterval);

        timer.endTimer();
      }

    }, 1000);
  },

  endTimer: function() {
    var answerTitle = document.createElement('h3');
    answerTitle.textContent = "GAME OVER!!!";
    answerContainer.prepend(answerTitle);
  },

  subtractTime: function(secToSubtract) {
    // Subract Time
  }
}

// Question Generator Object
var questionsGenerator = {

  // Array of Question dictionaries
  questions: [

    // Dictionaries of question and answers
    {
      question: "Which of the following is JSON most like?",
      answer: "List",
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
      question: "What is not a property of a background",
      answer: "background-action",
      wAnswer: [
        "margin",
        "color",
        "background-size",
      ]
    }
  ],

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

  getRandomQuestion: function() {
    var randQ = this.questions[Math.floor(Math.random() * this.questions.length)];
    questEl.textContent = randQ.question;
    this.createAnswerList(randQ);
  }
}

questionsGenerator.getRandomQuestion();
timer.startTimer();
