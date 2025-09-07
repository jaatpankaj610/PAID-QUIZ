document.addEventListener('DOMContentLoaded', () => {
    // वेरिएबल्स इनिशियलाइज़ करें
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const scoreEl = document.getElementById('score');
    const progressBar = document.getElementById('progress');
    
    let currentQuestion = 0;
    let score = 0;
    let questions = [];
    
    // क्वेश्चन लोड करें
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            totalQuestionsEl.textContent = questions.length;
            showQuestion();
        })
        .catch(error => {
            console.error('क्वेश्चन लोड करने में त्रुटि:', error);
            questionText.textContent = "क्वेश्चन लोड करने में समस्या हुई। कृपया बाद में पुनः प्रयास करें।";
        });
    
    // क्वेश्चन दिखाने का फंक्शन
    function showQuestion() {
        if (currentQuestion >= questions.length) {
            showResults();
            return;
        }
        
        const question = questions[currentQuestion];
        questionText.textContent = question.question;
        currentQuestionEl.textContent = currentQuestion + 1;
        
        // प्रोग्रेस बार अपडेट करें
        const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // ऑप्शन क्लियर करें
        optionsContainer.innerHTML = '';
        
        // ऑप्शन बनाएं
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.classList.add('option-btn');
            optionBtn.innerHTML = `<span>${option}</span>`;
            
            // ऑप्शन क्लिक इवेंट
            optionBtn.addEventListener('click', () => {
                // सभी ऑप्शन डिसेबल करें
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.disabled = true;
                });
                
                // सही/गलत चेक करें
                if (option === question.correctAnswer) {
                    optionBtn.classList.add('correct');
                    score++;
                    scoreEl.textContent = score;
                } else {
                    optionBtn.classList.add('incorrect');
                    
                    // सही उत्तर हाइलाइट करें
                    document.querySelectorAll('.option-btn').forEach(btn => {
                        if (btn.textContent.trim() === question.correctAnswer) {
                            btn.classList.add('correct');
                        }
                    });
                }
                
                // 1 सेकंड बाद अगला क्वेश्चन
                setTimeout(() => {
                    currentQuestion++;
                    showQuestion();
                }, 1000);
            });
            
            optionsContainer.appendChild(optionBtn);
        });
    }
    
    // रिजल्ट दिखाने का फंक्शन
    function showResults() {
        questionText.textContent = "क्विज पूरा हुआ!";
        optionsContainer.innerHTML = `
            <div class="result-container">
                <div class="result-score">
                    <h2>आपका स्कोर</h2>
                    <div class="score-value">${score} / ${questions.length}</div>
                </div>
                <div class="result-message">
                    ${score === questions.length ? 
                        '<i class="fas fa-trophy"></i> बधाई हो! आपने पूर्ण अंक प्राप्त किए!' : 
                        score >= questions.length / 2 ? 
                        '<i class="fas fa-thumbs-up"></i> अच्छा प्रदर्शन! बेहतरीन कोशिश!' : 
                        '<i class="fas fa-redo"></i> अभ्यास करने की जरूरत है! फिर से कोशिश करें!'}
                </div>
                <button id="restart-btn" class="restart-btn">क्विज फिर से शुरू करें</button>
            </div>
        `;
        
        // रीस्टार्ट बटन इवेंट
        document.getElementById('restart-btn').addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            scoreEl.textContent = score;
            progressBar.style.width = '0%';
            showQuestion();
        });
    }
});
