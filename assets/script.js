var startBtn = document.querySelector("#start-quiz");
var submitBtn = document.querySelector('#submit')
var startOverBtn = document.querySelector('#return');
var resetScoreBtn = document.querySelector('#reset');
var introDiv = document.querySelector("#intro");
var quizDiv = document.querySelector("#quiz-section");
var feedbackDiv = document.querySelector("#feedback")
var formDiv = document.querySelector ('#completed')
var questionEl = document.querySelector('#questions'); 
var answerEl = document.querySelector('#answer-choice');
var timerEl = document.querySelector('#timer');
var formEl = document.querySelector('#submission')
var highScoresDiv = document.querySelector('#scores')

var prompts = [
    {
        question: "Commonly used data types do NOT include:",
        answers: [
            {option: "Strings", correct: false},
            {option: "Alerts", correct: true},
            {option: "Booleans", correct: false},
            {option: "Numbers", correct: false}
        ]
    }, 
    {
        question: "The condition in an if / else statement is enclosed with _____.",
        answers: [
            {option: "Quotes", correct: false},
            {option: "Curly brackets", correct: false},
            {option:"Parenthesis", correct: true},
            {option: "Square brackets", correct: false},
        ]
    }, {
        question: "Arrays in JavaScript can be used to store ____.",
        answers: [
            {option: "Numbers and strings", correct: false},
            {option:"Other arrays", correct: false},
            {option: "Booleans", correct: false},
            {option: "All of the above", correct: true},
        ]
    }, {
        question: "String values must be enclosed within ____ when being assigned to variables.",
        answers: [
            {option: "Commas ,", correct: false},
            {option: "Curly brackets", correct: false},
            {option: "Quotes", correct: true},
            {option: "Parenthesis", correct: false},
        ]
    }, {
        question: "A very useful tool used during development and debugging for printing the debugger is:",
        answers: [
            {option: "JavaScript", correct: false},
            {option: "Terminal/Bash", correct: false},
            {option: "for Loops", correct: false},
            {option: "console.log", correct: true},
        ]
    }
]
var shuffle 
var currentQuestion
var remainingTime = 75; 

startBtn.addEventListener('click', startGame)
submitBtn.addEventListener('click', submit)
startOverBtn.addEventListener('click', startOver)
resetScoreBtn.addEventListener('click', clearStorage)

function startGame(){
    introDiv.removeAttribute("class");
    introDiv.setAttribute("class", "hide");
    quizDiv.removeAttribute("class");
    shuffle = prompts.sort()
    currentQuestion = 0
    nextQuestion();
    startCountdown();
}

function nextQuestion(){
    showQuestion(shuffle[currentQuestion])
}

function showQuestion(prompt){
    questionEl.textContent = prompt.question;
    console.log(prompt.question)
    for (var i=0; i<4; i++) {
        answerEl.children[i].textContent = prompt.answers[i].option;
        var valid = prompt.answers[i].correct; 
        if (valid) {
            answerEl.children[i].dataset.correct = valid;
        }
        answerEl.children[i].addEventListener('click', chooseAnswer)
    }
    currentQuestion++
}

function chooseAnswer(event) {
    var selectedAnswer = event.target;
    var correct = selectedAnswer.dataset.correct
    if (correct) {
        feedbackDiv.removeAttribute("class"); 
        feedbackDiv.children[1].textContent = "Correct!";
    } else {
        remainingTime -= 5
        feedbackDiv.removeAttribute('class');
        feedbackDiv.children[1].textContent = "Incorrect!"
    }
    if (shuffle.length > currentQuestion){
        nextQuestion()
    } else {
        formDiv.removeAttribute('class');
        formEl.removeAttribute('class');
        quizDiv.setAttribute('class', 'hide');
        feedbackDiv.setAttribute('class','hide') 
    }
}

function startCountdown(){
    var timeInterval = setInterval (function timer(){
        remainingTime--;
        timerEl.textContent = 'Time: ' + remainingTime; 

        if (remainingTime === 0) {
            clearInterval(timeInterval);
            formDiv.children[1].textContent = "Your score is 0"
        } else if (remainingTime !== 0 && shuffle.length == currentQuestion) {
            clearInterval (timeInterval); 
            formDiv.children[1].textContent = "Your score is " + remainingTime
        }
    }, 1000)
}



function startOver (){
    highScoresDiv.setAttribute('class','hide');
    introDiv.removeAttribute('class');
    remainingTime = 75
    timerEl.textContent = "Time: " + remainingTime
}

function submit(event) {
    event.preventDefault();
    var pastHistory = JSON.parse(localStorage.getItem("quiz-scores"))
    var initials = document.querySelector("#initials-input").value
    pastHistory.push({
        score: remainingTime,
        user: initials
    })
    localStorage.setItem("quiz-scores", JSON.stringify(pastHistory))
    formEl.setAttribute('class', 'hide');
    highScoresDiv.removeAttribute('class');
    displayTopScoresUpdate()
}

function startOver() {
    highScoresDiv.setAttribute('class', 'hide');
    formDiv.setAttribute('class','hide')
    introDiv.removeAttribute('class');
    remainingTime = 75
    timerEl.textContent = "Time: " + remainingTime
    scoresHead.textContent = "Previous Scores"
    scoresListEnd.textContent = ''
}
var scoresListEnd = document.querySelector("#scores-list-end")
function displayTopScoresUpdate() {
    var pastHistory = JSON.parse(localStorage.getItem("quiz-scores"))
    for (var i = 0; i < pastHistory.length; i++){
        scoresListEnd.innerHTML+= `<li>${pastHistory[i].user}: ${pastHistory[i].score}</li>`
    }
    
}

function createStorage(){
    if(!localStorage.getItem("quiz-scores")){
        localStorage.setItem("quiz-scores", JSON.stringify([]))
    }
}
var scoresHead = document.querySelector("#scores-head");
function clearStorage() {
    localStorage.clear()
    createStorage()
    scoresHead.textContent = "Take quiz to record score!"
    scoresListEnd.textContent = ''
}

createStorage()


