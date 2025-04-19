let quizData = [];
let correctAnswers = [];
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let timerInterval;
let couleur = "brown";

let apiUrl; // Define apiUrl globally

// Retrieve the questions of the quiz from the URL 
function fetchQuizData() {
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                console.error('Failed to fetch quiz data: Network response was not ok.');
                return [];
            }
            return response.json();
        })
        .then(data => data.results)
        .catch(error => {
            console.error('Error fetching quiz data:', error.message);
            return []; // Return an empty array to prevent breaking the app
        });
}

function startQuiz() {
    document.getElementById('resultat').style.display = 'none';
    document.getElementById('qst').style.display = 'none';

    // Fetch quiz data
    fetchQuizData().then(results => {
        if (results.length === 0) {
            // Handle empty data case
            alert('Failed to load quiz questions. Please check your API settings or try again.');
            return;
        }

        // If data is valid, continue
        document.querySelector('.form-api').style.display = 'none';
        document.getElementById('qst').style.display = 'block';

        quizData = results.map(q => ({
            question: decodeHTML(q.question),
            options: shuffleArray([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
            type: q.type,
        }));

        correctAnswers = results.map(q => decodeHTML(q.correct_answer));

        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        showQuestion(0);
    });
}

function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuestion(index) {
    if (index >= quizData.length) return;

    const question = quizData[index];
    document.getElementById('q1').textContent = `Q${index + 1}`;
    document.getElementById('q2').textContent = question.question;

    const options = document.querySelectorAll('.choices button');

    if (question.type === "boolean") {
        // Show only two buttons for True/False questions
        options[0].style.display = 'block';
        options[0].textContent = "True";
        options[1].style.display = 'block';
        options[1].textContent = "False";
        options[2].style.display = 'none';
        options[3].style.display = 'none';
    } else {
        // Show all options for multiple-choice questions
        options.forEach((btn, i) => {
            btn.style.display = 'block';
            btn.textContent = question.options[i];
            btn.style.backgroundColor = '';
        });
    }

    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = 10;
    const timerElement = document.getElementById("compteur");

    timerElement.textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            validateAnswer();
        }
    }, 1000);
}

function validateAnswer() {
    clearInterval(timerInterval);
    const selected = document.querySelector(`.choices button[style*=${couleur}]`);
    userAnswers[currentQuestion] = selected ? selected.textContent : null;

    if (selected && selected.textContent === correctAnswers[currentQuestion]) {
        score++;
    }

    currentQuestion++;
    if (currentQuestion < quizData.length) {
        showQuestion(currentQuestion);
    } else {
        endQuiz();
    }
}

function endQuiz() {
    // Hide questions, show the result
    document.getElementById('qst').style.display = 'none';
    document.getElementById('resultat').textContent = `Score final: ${score}/${quizData.length}`;
    document.getElementById('resultat').style.display = 'block';
    document.getElementById('start').disabled = false;
}

// Initialize answer selection
document.querySelectorAll('.choices button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.choices button').forEach(b =>
            b.style.backgroundColor = '');
        this.style.backgroundColor = couleur;
    });
});

// Initialize validation button
document.getElementById('val').addEventListener('click', validateAnswer);

// The function go() creates an URL based on the given information
function go() {
    const nbr = document.getElementById("trivia_amount").value;
    const category = document.querySelector('select[name="trivia_category"]').value;
    const difficulty = document.querySelector('select[name="trivia_difficulty"]').value;
    const type = document.querySelector('select[name="trivia_type"]').value;
    const encode = document.querySelector('select[name="trivia_encode"]').value;

    if (nbr < 1 || nbr > 50) {
        alert("Please enter a number between 1 and 50 for the number of questions.");
        return false;
    }

    const params = [
        `amount=${nbr}`,
        category !== "any" ? `category=${category}` : "",
        difficulty !== "any" ? `difficulty=${difficulty}` : "",
        type !== "any" ? `type=${type}` : "",
        encode !== "default" ? `encode=${encode}` : "",
    ].filter(Boolean).join("&");

    apiUrl = `https://opentdb.com/api.php?${params}`;

    return false; // Prevent form submission
}