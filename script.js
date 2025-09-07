document.addEventListener('DOMContentLoaded', () => {
    // पेमेंट स्टेटस चेक करें
    checkPaymentStatus();
    
    // वेरिएबल्स इनिशियलाइज़ करें
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const scoreEl = document.getElementById('score');
    const progressBar = document.getElementById('progress');
    const daysLeftEl = document.getElementById('days-left');
    const paymentOverlay = document.getElementById('payment-overlay');
    const payNowBtn = document.getElementById('pay-now-btn');
    
    let currentQuestion = 0;
    let score = 0;
    let questions = [];
    
    // पेमेंट स्टेटस चेक फंक्शन
    function checkPaymentStatus() {
        const paymentStatus = localStorage.getItem('paymentStatus');
        const paymentExpiry = localStorage.getItem('paymentExpiry');
        
        if (paymentStatus === 'paid' && paymentExpiry) {
            const expiryDate = new Date(paymentExpiry);
            const currentDate = new Date();
            
            if (currentDate <= expiryDate) {
                // पेमेंट वैलिड है
                const daysLeft = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
                daysLeftEl.textContent = daysLeft;
                
                // क्विज़ लोड करें
                loadQuiz();
            } else {
                // पेमेंट एक्सपायर्ड हो गया
                localStorage.removeItem('paymentStatus');
                localStorage.removeItem('paymentExpiry');
                showPaymentOverlay();
            }
        } else {
            // पेमेंट नहीं किया गया
            showPaymentOverlay();
        }
    }
    
    // पेमेंट ओवरले दिखाने का फंक्शन
    function showPaymentOverlay() {
        paymentOverlay.classList.add('active');
        
        // पेमेंट बटन क्लिक इवेंट
        payNowBtn.addEventListener('click', () => {
            window.location.href = 'payment.html';
        });
    }
    
    // क्विज़ लोड करने का फंक्शन
    function loadQuiz() {
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
    }
    
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
        questionText.textContent = "क्विज़ पूरा हुआ!";
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
                <button id="restart-btn" class="restart-btn">क्विज़ फिर से शुरू करें</button>
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
    
    // कैटेगरी कार्ड्स के लिए इवेंट लिसनर
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // यहां आप कैटेगरी के आधार पर क्वेश्चन लोड कर सकते हैं
            // अभी के लिए सिर्फ UI प्रतिक्रिया दिखा रहे हैं
            currentQuestion = 0;
            score = 0;
            scoreEl.textContent = score;
            progressBar.style.width = '0%';
            showQuestion();
        });
    });
});
