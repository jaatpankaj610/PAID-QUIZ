let currentQuestion = 0;
let score = 0;
let timer;
let quizData = [];

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const quizContainer = document.querySelector('.quiz-container');

// सवालों को questions.json से लाएँ
fetch('questions.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('questions.json लोड नहीं हुआ');
        }
        return response.json();
    })
    .then(data => {
        quizData = data;
        showQuestion();
    })
    .catch(error => {
        console.error('सवाल लोड करने में त्रुटि:', error);
        questionElement.innerText = 'सवाल लोड करने में त्रुटि हुई।';
    });

// वर्तमान सवाल और विकल्प दिखाएँ
function showQuestion() {
    if (currentQuestion >= quizData.length) {
        showResult();
        return;
    }

    const question = quizData[currentQuestion];
    questionElement.innerText = question.question;
    optionsElement.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('div');
        button.innerText = option;
        button.classList.add('option');
        button.addEventListener('click', () => selectAnswer(option));
        optionsElement.appendChild(button);
    });

    // टाइमर शुरू करें
    startTimer();
}

// टाइमर शुरू करें
function startTimer() {
    let timeLeft = 15;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer(null);
        }
    }, 1000);
}

// जवाब चुनने की प्रक्रिया
function selectAnswer(selectedOption) {
    clearInterval(timer);
    const correctAnswer = quizData[currentQuestion].answer;
    const buttons = optionsElement.querySelectorAll('.option');

    buttons.forEach(button => {
        if (button.innerText === correctAnswer) {
            button.classList.add('correct');
        } else if (button.innerText === selectedOption && selectedOption !== correctAnswer) {
            button.classList.add('wrong');
        }
        button.style.pointerEvents = 'none';
    });

    if (selectedOption === correctAnswer) {
        score++;
    }

    // 1 सेकंड बाद अगला सवाल
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1000);
}

// अंतिम परिणाम दिखाएँ
function showResult() {
    quizContainer.innerHTML = `
        <div class="result-container">
            <h2>क्विज़ पूरा हुआ!</h2>
            <p>आपका स्कोर: <span id="score">${score}</span>/${quizData.length}</p>
            <button class="restart-btn">फिर से शुरू करें</button>
        </div>
    `;
    document.querySelector('.restart-btn').addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        quizContainer.innerHTML = `
            <header class="quiz-header">
                <h2>क्विज़ ऐप</h2>
                <div class="quiz-timer">
                    <i class="fas fa-stopwatch"></i>
                    <span id="timer">15</span> सेकंड
                </div>
            </header>
            <div class="question-container">
                <h3 id="question">यहाँ सवाल दिखेगा</h3>
            </div>
            <div class="options-container" id="options"></div>
            <div class="result-container" id="result" style="display: none;">
                <h2>क्विज़ पूरा हुआ!</h2>
                <p>आपका स्कोर: <span id="score">0</span></p>
                <button class="restart-btn">फिर से शुरू करें</button>
            </div>
        `;
        showQuestion();
    });
}