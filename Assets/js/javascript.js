// Initialize with a dynamic start page with Start Button

// Click a button to start the quiz

// Timer starts counting down

// Page Shows a random question with a list of answers

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
var answerEl = document.getElementById('answer');

// Timer Object
var timer = {
  startTime: 180,

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

  endTimer() {
    answerEl.textContent = "GAME OVER!!!"

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
    
    return ansList;
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
    
    var ansList = this.createAnswerList(randQ);
    var shuffledAnswers = this.shuffleAnswers(ansList);

    answerEl.textContent = shuffledAnswers;
  }
}

questionsGenerator.getRandomQuestion();
timer.startTimer();
