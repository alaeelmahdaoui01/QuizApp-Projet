

<template>
    <div id="quiz-app" class="quiz-app-container">
        <div v-if="loading">Loading quiz...</div>
  
        <div v-else-if="alreadyTaken">
            <h1>OOPS...</h1>
            <p>You have already taken this quiz!</p>
            <button @click="goBack" class="reset-btn">Go back to Home page</button>
        </div>
  
        <div v-else-if="!quizData.length">
            <p>Quiz not found or no questions available!</p>
        </div>
    
  
        <div v-else>
            <div class="quiz-container">
  
  
                <div v-if="currentQuestion < quizData.length" class="question-box">
                    <div class="question-header">
                        <h3>Question {{ currentQuestion + 1 }}/{{ quizData.length }}</h3>
                        <!-- <p class="timer" :style="{ color: timer <= 5 ? '#ff5e7d' : '#fff' }">Time left: {{ timer }}</p> -->
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
                    <button @click="goBack" class="reset-btn">Go back to Home page</button>
                </div>
  
  
            </div>
        </div>
    
    </div>
  
  </template>
  
  
  
  <script>
  
  import firebase from "firebase/app";
  import "firebase/firestore"; // make sure this is imported
  import { app as db } from "@/Firebase/config.js";
  
  import { getUser } from "@/Firebase/Authentification/getUser.js";
  
  export default {
    async mounted() {
            const currentUser = getUser();
            if (!currentUser) {
                console.error("User not authenticated.");
                this.loading = false;
                return;
            }
  
            try {
                const userRef = db.collection("users").doc(currentUser.uid);
                const userSnap = await userRef.get();
                const userData = userSnap.data();
  
                const alreadyPassed = userData.quizzes?.some(q => q.quizId === this.id);
                if (alreadyPassed) {
                    this.alreadyTaken = true;
                    this.loading = false;
                    this.quizData = []; // Empty the quiz to show "Quiz not found"
                    //alert("You have already taken this quiz.");
                    return;
                }
  
                await this.fetchQuizData();
            } catch (error) {
                console.error("Error checking quiz attempt:", error);
                this.loading = false;
            }
  },
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
            quizStarted: true,
            timer: 10,
            timerInterval: null,
            loading: true,
            isAnswerCorrect: null,
            correctAnswer: '',
            isAnswered: false,
            startTime: null,
            endTime: null,
            alreadyTaken: false,
            quizname: '',
        };
    },
    methods: {
        async fetchQuizData() {
            try {
            const quizRef = db.collection("quizzes").doc(this.id);
            const quizSnap = await quizRef.get();
  
            if (quizSnap.exists) {
                const quiz = quizSnap.data();
                this.quizname = quiz.title;
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
                this.startTime = Date.now();
                this.startTimer();
            },
            // startTimer() {
            //     this.timer = 10;
            //     clearInterval(this.timerInterval);
            //     this.timerInterval = setInterval(() => {
            //     if (this.timer > 0 && !this.isAnswered) {
            //         this.timer--;
            //     } else {
            //         this.validateAnswer();
            //     }
            //     }, 1000);
            // },
            startTimer() {
      this.timer = 10;
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
          if (this.timer > 0 && !this.isAnswered) {
              this.timer--;
          } else if (!this.isAnswered) {
              clearInterval(this.timerInterval);  // Clear interval when time's up
              setTimeout(() => {
                  this.validateAnswer(); // Delay the validation by 1 second
              }, 1000);
          }
      }, 1000);
  }
  ,
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
                } else {
                    this.endTime = Date.now();
                    this.saveUserQuizResult(); // Save result to Firebase
                }
  
            },
            goBack() {
                this.$router.push('/homeuser');
            },
            async saveUserQuizResult() {
                try {
                    const currentUser = getUser();
                    if (!currentUser) {
                    console.error("User not authenticated.");
                    return;
                    }
  
                    const duration = Math.floor((this.endTime - this.startTime) / 1000); // seconds
                    const quizResult = {
                    userId: currentUser.uid,
                    score: this.score,
                    total: this.quizData.length,
                    // timeSpent: duration,
                    date: new Date().toISOString(),
                    };
  
                    // 1. Save to user's document
                    const userRef = db.collection("users").doc(currentUser.uid);
                    await userRef.update({
                    quizzes: firebase.firestore.FieldValue.arrayUnion({
                        quizname : this.quizname, 
                        quizId: this.id,
                        ...quizResult
                    }),
                    });
  
                    // 2. Save to quiz's document (add participant)
                    const quizRef = db.collection("quizzes").doc(this.id);
                    await quizRef.set({
                    participants: firebase.firestore.FieldValue.arrayUnion(quizResult)
                    }, { merge: true });
  
                    console.log("✅ Quiz result saved to both user and quiz documents.");
                } catch (error) {
                    console.error("❌ Error saving quiz result:", error);
                }
                }
  
  
  
            },
            computed: {
                currentQuestionData() {
                    return this.quizData[this.currentQuestion];
                },
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
  padding: 100px 2rem 4rem; /* Increased bottom padding */
  box-sizing: border-box;
  }
  
  /* Quiz container */
  .quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  /* Question box */
  .question-box {
  margin-bottom: 2rem;
  }
  
  .question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .question-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  }
  
  .timer {
  font-size: 1rem;
  color: #ff5e7d;
  font-weight: 500;
  }
  
  .question {
  font-size: 1.3rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  color: white;
  }
  
  /* Options grid */
  .options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  }
  
  .options button {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  }
  
  .options button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  }
  
  .options .selected {
  background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  }
  
  /* Buttons */
  .validate-btn,
  .next-btn,
  .reset-btn {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 1.5rem auto 0;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  }
  
  .validate-btn {
  background: linear-gradient(135deg, #8a8aff 0%, #5757ff 100%);
  color: white;
  }
  
  .validate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 108, 255, 0.4);
  }
  
  .validate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
  }
  
  .next-btn {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  }
  
  .next-btn:hover {
  background: linear-gradient(135deg, #388e3c 0%, #4caf50 100%);
  transform: translateY(-2px);
  }
  
  .reset-btn {
  background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
  color: white;
  margin-top: 2rem;
  }
  
  .reset-btn:hover {
  background: linear-gradient(135deg, #ff2d5f 0%, #ff5e7d 100%);
  transform: translateY(-2px);
  }
  
  /* Feedback section */
  .answer-feedback {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: center;
  }
  
  .correct-feedback {
  color: #4caf50;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  }
  
  .incorrect-feedback {
  color: #f44336;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  }
  
  .correct-answer {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  }
  
  /* Results section */
  .results {
  text-align: center;
  }
  
  .results h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #ff5e7d;
  }
  
  .results p {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  }
  
  .summary {
  margin: 2rem 0;
  text-align: left;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  }
  
  .summary h3 {
  margin-top: 0;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
  }
  
  .summary ul {
  list-style: none;
  padding: 0;
  margin: 0;
  }
  
  .summary li {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .summary li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
  }
  
  .summary strong {
  color: rgba(255, 255, 255, 0.9);
  }
  
  .user-answer.correct {
  color: #4caf50;
  }
  
  .user-answer.incorrect {
  color: #f44336;
  }
  
  .correct-answer-label {
  color: rgba(255, 255, 255, 0.7);
  }
  
  /* Already taken section */
  .already-taken {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  }
  
  .already-taken h1 {
  color: #ff5e7d;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  }
  
  .already-taken p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
  .quiz-app-container {
    padding: 80px 1.5rem 3rem;
  }
  
  .quiz-container {
    padding: 1.5rem;
  }
  
  .options {
    grid-template-columns: 1fr;
  }
  
  .question {
    font-size: 1.2rem;
  }
  
  .results h2 {
    font-size: 1.8rem;
  }
  
  .validate-btn,
  .next-btn,
  .reset-btn {
    font-size: 1rem;
    padding: 0.9rem;
  }
  }
  
  @media (max-width: 480px) {
  .quiz-app-container {
    padding: 70px 1rem 2rem;
  }
  
  .question-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .timer {
    align-self: flex-end;
  }
  }
  </style>