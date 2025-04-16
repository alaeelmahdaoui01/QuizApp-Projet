<template>
    <div id="quiz-app" class="quiz-app-container">
  <div v-if="loading">Loading quiz...</div>

  <div v-else-if="!quizData.length">
    <p>Quiz not found or no questions available!</p>
  </div>

  <div v-else>
    <div v-if="!quizStarted" class="intro">
      <button @click="startQuiz" class="start-btn">Start Quiz</button>
    </div>

    <div v-else class="quiz-container">
      <div v-if="currentQuestion < quizData.length" class="question-box">
        <div class="question-header">
          <h3>Question {{ currentQuestion + 1 }}/{{ quizData.length }}</h3>
          <p class="timer">Time left: {{ timer }}</p>
        </div>
        
        <!-- Hide question, options, and validate button if answered -->
        <p v-if="!isAnswered" class="question">{{ currentQuestionData.question }}</p>

        <div v-if="!isAnswered" class="options">
          <button 
            v-for="(option, index) in currentQuestionData.options" 
            :key="index" 
            @click="selectOption(option)" 
            :class="{'selected': selectedOption === option}"
          >
            {{ option }}
          </button>
        </div>

        <button 
          v-if="!isAnswered" 
          @click="validateAnswer" 
          :disabled="!selectedOption" 
          class="validate-btn"
        >
          Validate
        </button>

        <!-- Feedback Message (only show after answering) -->
        <div v-if="isAnswered" class="answer-feedback">
          <p v-if="isAnswerCorrect" class="correct">Correct!</p>
          <p v-else class="incorrect">Incorrect! The correct answer was: {{ correctAnswer }}</p>
          <button @click="nextQuestion" class="next-btn">Next Question</button>
        </div>
      </div>

        <div v-else class="results">
            <h2>Quiz Completed!</h2>
            <p>Your Score: {{ score }}/{{ quizData.length }}</p>
            
            <div class="summary">
                <h3>Summary:</h3>
                <ul>
                <li v-for="(answer, index) in userAnswers" :key="index">
                    <p><strong>Question {{ index + 1 }}:</strong> {{ answer.question }}</p>
                    <p>
                    <span :class="{'correct': answer.isCorrect, 'incorrect': !answer.isCorrect}">
                        Your Answer: {{ answer.givenAnswer }} 
                        ({{ answer.isCorrect ? 'Correct' : 'Incorrect' }})
                    </span>
                    </p>
                    <p v-if="!answer.isCorrect">Correct Answer: {{ answer.correctAnswer }}</p>
                </li>
                </ul>
        </div>
  
  <button @click="resetQuiz" class="reset-btn">Restart</button>
</div>

    </div>
  </div>
</div>

  </template>
  
  <script>
  import { app as db } from "@/Firebase/config.js";
  
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
        return {
            quizData: [],
            currentQuestion: 0,
            selectedOption: null,
            userAnswers: [], // Track user answers and correctness
            score: 0,
            quizStarted: false,
            timer: 10,
            timerInterval: null,
            loading: true,
            isAnswerCorrect: null,
            correctAnswer: '',
            isAnswered: false,
        };
    },
    methods: {
        async fetchQuizData() {
            try {
            const quizRef = db.collection("quizzes").doc(this.id);
            const quizSnap = await quizRef.get();

            if (quizSnap.exists) {
                const quiz = quizSnap.data();
                this.quizData = quiz.questions.map((q) => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                }));
            } else {
                console.error("Quiz not found!");
            }
            } catch (error) {
            console.error("Error fetching quiz:", error);
            } finally {
            this.loading = false;
            }
            },
            startQuiz() {
                this.quizStarted = true;
                this.startTimer();
            },
            startTimer() {
                this.timer = 10;
                clearInterval(this.timerInterval);
                this.timerInterval = setInterval(() => {
                if (this.timer > 0 && !this.isAnswered) {
                    this.timer--;
                } else {
                    this.validateAnswer();
                }
                }, 1000);
            },
            selectOption(option) {
                if (!this.isAnswered) {
                this.selectedOption = option;
                }
            },
            validateAnswer() {
                clearInterval(this.timerInterval);
                const isCorrect = this.selectedOption === this.currentQuestionData.correctAnswer;
                this.userAnswers.push({
                    question: this.currentQuestionData.question,
                    givenAnswer: this.selectedOption,
                    correctAnswer: this.currentQuestionData.correctAnswer,
                    isCorrect,
                });
                this.correctAnswer = this.currentQuestionData.correctAnswer,
                this.isAnswerCorrect = isCorrect;
                if (isCorrect) {
                    this.score++;
                }
                this.isAnswered = true;
            },
            nextQuestion() {
                this.selectedOption = null;
                this.isAnswerCorrect = null;
                this.correctAnswer = '';
                this.isAnswered = false; // Reset for next question
                this.currentQuestion++;
                if (this.currentQuestion < this.quizData.length) {
                this.startTimer();
                }
            },
            resetQuiz() {
                this.currentQuestion = 0;
                this.score = 0;
                this.selectedOption = null;
                this.userAnswers = []; // Reset user answers
                this.isAnswerCorrect = null;
                this.isAnswered = false;
                this.quizStarted = false;
                clearInterval(this.timerInterval);
            },
            },
            computed: {
                currentQuestionData() {
                    return this.quizData[this.currentQuestion];
                },
            },
            async mounted() {
                await this.fetchQuizData();
            },
            beforeUnmount() {
                clearInterval(this.timerInterval);
            },
    };

</script>


<style>
  /* Main container styling */
  .quiz-app-container {
    position: relative;
    min-height: 100vh;
    background-color: #1e1e2f;
    color: white;
    overflow: hidden;
    padding: 100px 2rem 2rem;
    box-sizing: border-box;
  }
  .summary {
  margin-top: 2rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
}

.summary ul {
  list-style: none;
  padding: 0;
}

.summary li {
  margin-bottom: 1rem;
}

.correct {
  color: #4caf50; /* Green */
  font-weight: bold;
}

.incorrect {
  color: #f44336; /* Red */
  font-weight: bold;
}

/* Next Question button styling */
.next-btn {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
}

/* Hide feedback message until answered */
.answer-feedback {
  margin-top: 1rem;
  text-align: center;
}

  /* Container for quiz content */
  .quiz-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  /* Intro section styling */
  .intro {
    text-align: center;
  }

  .start-btn {
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 1rem 2.5rem;
    font-size: 1.2rem;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .answer-feedback {
  margin-top: 1rem;
  text-align: center;
}

.correct {
  color: #4caf50; /* Green for correct answer */
  font-weight: bold;
}

.incorrect {
  color: #f44336; /* Red for incorrect answer */
  font-weight: bold;
}

  .start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
    background: linear-gradient(135deg, #ff2d5f 0%, #ff5e7d 100%);
  }

  /* Question box styling */
  .question-box {
    margin-bottom: 2rem;
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .timer {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .question {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    color: white;
  }

  /* Options button grid */
  .options {
    display: flex; /* Change grid to flex */
    flex-wrap: wrap; /* Allow wrapping of options */
    justify-content: center; /* Center buttons horizontally */
    align-items: center; /* Center buttons vertically */
    gap: 1rem; /* Maintain space between buttons */
    margin-bottom: 1.5rem;
    }

  .options button {
    padding: 0.875rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .options button:hover {
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  }

  /* Selected option styling */
  .options .selected {
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
  }

  /* Validate button styling */
  .validate-btn {
    background: linear-gradient(135deg, #8a8aff 0%, #5757ff 100%);
    color: white;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(100, 108, 255, 0.3);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .validate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(100, 108, 255, 0.4);
  }

  /* Results screen styling */
  .results {
    text-align: center;
    margin-top: 2rem;
  }

  .results h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #ff5e7d;
  }

  .results p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }

  .reset-btn {
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 1rem 2.5rem;
    font-size: 1.2rem;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .reset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
    background: linear-gradient(135deg, #ff2d5f 0%, #ff5e7d 100%);
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    .options {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .quiz-container {
      padding: 1.5rem;
    }

    .start-btn,
    .validate-btn,
    .reset-btn {
      font-size: 1rem;
      padding: 0.75rem 2rem;
    }
  }

  @media (max-width: 576px) {
    .options {
      grid-template-columns: 1fr;
    }

    .options button {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
  }
</style>
