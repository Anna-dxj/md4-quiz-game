const startBtn = document.querySelector('#start-quiz');
const submitBtn = document.querySelector('#submit')
const startOverBtn = document.querySelector('#return');
const resetScoreBtn = document.querySelector('#reset');
const introDiv = document.querySelector('#intro');
const quizDiv = document.querySelector('#quiz-section');
const feedbackDiv = document.querySelector('#feedback');
const highScoresDiv = document.querySelector('#scores');
const formDiv = document.querySelector ('#completed');
const questionEl = document.querySelector('#questions'); 
const answerEl = document.querySelector('#answer-choice');
const timerEl = document.querySelector('#timer');
const formEl = document.querySelector('#submission');
const scoresListEnd = document.querySelector('#scores-list-end');
const scoresHead = document.querySelector('#scores-head');
const scoresListSide = document.querySelector('#scores-list-side');

const prompts = [
    {
        question: 'Commonly used data types do NOT include:',
        answers: [
            {option: 'Strings', correct: false},
            {option: 'Alerts', correct: true},
            {option: 'Booleans', correct: false},
            {option: 'Numbers', correct: false}
        ],
    }, 
    {
        question: 'The condition in an if / else statement is enclosed with _____.',
        answers: [
            {option: 'Quotes', correct: false},
            {option: 'Curly brackets', correct: false},
            {option: 'Parenthesis', correct: true},
            {option: 'Square brackets', correct: false},
        ],
    }, 
    {
        question: 'Arrays in JavaScript can be used to store ____.',
        answers: [
            {option: 'Numbers and strings', correct: false},
            {option: 'Other arrays', correct: false},
            {option: 'Booleans', correct: false},
            {option: 'All of the above', correct: true},
        ],
    }, 
    {
        question: 'String values must be enclosed within ____ when being assigned to variables.',
        answers: [
            {option: 'Commas', correct: false},
            {option: 'Curly brackets', correct: false},
            {option: 'Quotes', correct: true},
            {option: 'Parenthesis', correct: false},
        ],
    }, 
    {
        question: 'A very useful tool used during development and debugging for printing the debugger is:',
        answers: [
            {option: 'JavaScript', correct: false},
            {option: 'Terminal/Bash', correct: false},
            {option: 'for Loops', correct: false},
            {option: 'console.log', correct: true},
        ],
    },
];

let shuffle;
let currentQuestion;
let remainingTime = 75; 

const nextQuestion = () => {
    showQuestion(shuffle[currentQuestion]);
};

const showQuestion = (prompt) => {
    questionEl.textContent = prompt.question;

    for (let i = 0; i < 4; i++) {
        answerEl.children[i].textContent = prompt.answers[i].option;
        const valid = prompt.answers[i].correct; 
        if (valid) {
            answerEl.children[i].dataset.correct = valid;
        }
        answerEl.children[i].addEventListener('click', chooseAnswer);
    }
    currentQuestion++;
}

const chooseAnswer = (event) => {
    const selectedAnswer = event.target;
    const correct = selectedAnswer.dataset.correct;

    if (correct) {
        feedbackDiv.removeAttribute('class'); 
        feedbackDiv.children[1].textContent = 'Correct!';
    } else {
        remainingTime -= 5;
        feedbackDiv.removeAttribute('class');
        feedbackDiv.children[1].textContent = 'Incorrect!';
    }

    if (shuffle.length > currentQuestion){
        nextQuestion();
    } else {
        formDiv.removeAttribute('class');
        formEl.removeAttribute('class');
        displayTopScoresUpdate();
        highScoresDiv.removeAttribute('class');
        quizDiv.setAttribute('class', 'hide');
        feedbackDiv.setAttribute('class','hide');
    }
};

const startCountdown = () => {
    const timeInterval = setInterval (() => {
        remainingTime--;
        timerEl.textContent = `Time: ${remainingTime}`; 
        
        if (remainingTime === 0) {
            clearInterval(timeInterval);
            formDiv.children[0].textContent = 'All done! Your score is 0';
        } else if (remainingTime !== 0 && shuffle.length == currentQuestion) {
            clearInterval (timeInterval); 
            formDiv.children[0].textContent = `All done! Your score is ${remainingTime}`;
        }
    }, 1000);
}

const displayTopScoresUpdate = () => {
    const pastHistory = JSON.parse(localStorage.getItem('quiz-scores'));
    scoresListEnd.innerHTML = '';
    for (let i = 0; i < pastHistory.length; i++) {
        scoresListEnd.innerHTML+= `<li>${pastHistory[i].user}: ${pastHistory[i].score}</li>`;
    }
};

const createStorage = () => {
    if(!localStorage.getItem('quiz-scores')) {
        localStorage.setItem('quiz-scores', JSON.stringify([]));
    }
};

const handleStartGame = () => {
    introDiv.removeAttribute('class');
    introDiv.setAttribute('class', 'hide');
    quizDiv.removeAttribute('class');
    shuffle = prompts.sort();
    currentQuestion = 0;
    nextQuestion();
    startCountdown();
};

const handleSubmit = (event) => {
    event.preventDefault();

    const pastHistory = JSON.parse(localStorage.getItem("quiz-scores"));
    const initials = document.querySelector("#initials-input").value;

    pastHistory.push({
        score: remainingTime,
        user: initials
    });
    pastHistory.sort((a, b) => b.score - a.score);

    localStorage.setItem("quiz-scores", JSON.stringify(pastHistory));

    formEl.setAttribute('class', 'hide');
    // highScoresDiv.removeAttribute('class');
    displayTopScoresUpdate();
};

const handleStartOver = () => {
    highScoresDiv.setAttribute('class', 'hide');
    formDiv.setAttribute('class','hide');
    introDiv.removeAttribute('class');
    remainingTime = 75
    timerEl.textContent = `Time: ${remainingTime}`
    scoresHead.textContent = "Previous Scores"
    scoresListEnd.textContent = ''
};

const handleClearStorage = () => {
    localStorage.clear();
    createStorage();
    scoresHead.textContent = 'Take quiz to record score!';
    scoresListEnd.textContent = '';
};

startBtn.addEventListener('click', handleStartGame);
submitBtn.addEventListener('click', handleSubmit);
startOverBtn.addEventListener('click', handleStartOver);
resetScoreBtn.addEventListener('click', handleClearStorage);

createStorage();