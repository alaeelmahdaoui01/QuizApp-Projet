<template>
    <div class="edit-container">
      <NavBarAdmin :user="user" />
      <main class="content-wrapper">
        <div class="form-container">
          <h2>Edit Quiz</h2>
  
          <!-- Existing questions list -->
          <div v-if="quiz" class="questions-section">
            <h3>Existing Questions</h3>
            <ul class="questions-list">
              <li v-for="(q, index) in quiz.questions" :key="index" class="question-item">
                <div class="question-content">
                  <strong class="question-text">{{ q.question }}</strong>
                  <ul class="options-list">
                    <li v-for="(opt, i) in q.options" :key="i" class="option-item">{{ opt }}</li>
                  </ul>
                  <p class="correct-answer">✅ Correct Answer: {{ q.correctAnswer }}</p>
                </div>
                <button @click="deleteQuestion(index)" class="action-button delete">Delete</button>
              </li>
            </ul>
          </div>
  
          <!-- Add new question -->
          <div class="add-question">
            <h3>Add New Question</h3>
            <form @submit.prevent="addQuestion" class="question-form">
              <div class="form-group">
                <label>Question:</label>
                <input type="text" v-model="newQuestion.question" required class="form-input" />
              </div>
              <div class="form-group">
                <label>Options (comma-separated):</label>
                <input type="text" v-model="optionsInput" required class="form-input" />
              </div>
              <div class="form-group">
                <label>Correct Answer:</label>
                <input type="text" v-model="newQuestion.correctAnswer" required class="form-input" />
              </div>
              <button type="submit" class="cta-button">Add Question</button>
            </form>
          </div>
        </div>
      </main>
      <div class="blur-circle"></div>
    </div>
  </template>
  
  <script>
  import { app } from '@/Firebase/config';
  import { editQuiz } from '@/Firebase/Firestore/edit';
  import NavBarAdmin from '@/components/NavBarAdmin.vue';
  import { getUser, waitForAuthInit } from '@/Firebase/Authentification/getUser';
  
  export default {
    name: 'EditView',
    components: {
      NavBarAdmin,
    },
    data() {
      return {
        user: null,
        quiz: null,
        newQuestion: {
          question: '',
          correctAnswer: '',
          options: [],
        },
        optionsInput: '',
      };
    },
    computed: {
      quizId() {
        return this.$route.params.id;
      },
    },
    async created() {
      try {
        await waitForAuthInit();
        this.user = getUser();
        
        if (!this.user) {
          console.warn('User not authenticated');
          this.$router.push('/login');
          return;
        }
        
        await this.fetchQuiz();
      } catch (error) {
        console.error('Error in EditView created hook:', error);
      }
    },
    methods: {
      async fetchQuiz() {
        try {
          const quizDoc = await app.collection('quizzes').doc(this.quizId).get();
          if (quizDoc.exists) {
            this.quiz = { id: quizDoc.id, ...quizDoc.data() };
          } else {
            console.error('Quiz not found');
          }
        } catch (err) {
          console.error('Error fetching quiz:', err);
        }
      },
      async deleteQuestion(index) {
        this.quiz.questions.splice(index, 1);
        await this.updateQuestions();
      },
      async addQuestion() {
        const options = this.optionsInput.split(',').map(opt => opt.trim());
        this.newQuestion.options = options;
  
        if (!options.includes(this.newQuestion.correctAnswer)) {
          alert("Correct answer must be one of the options.");
          return;
        }
  
        this.quiz.questions.push({ ...this.newQuestion });
        await this.updateQuestions();
  
        // Reset form
        this.newQuestion = { question: '', correctAnswer: '', options: [] };
        this.optionsInput = '';
      },
      async updateQuestions() {
        try {
          await editQuiz(this.quizId, {
            questions: this.quiz.questions,
          });
          console.log('Questions updated!');
        } catch (error) {
          console.error('Error updating questions:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .edit-container {
    position: relative;
    min-height: 100vh;
    background-color: #1e1e2f;
    color: white;
    overflow: hidden;
  }
  
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 2rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #ffffff, #c9d6ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-align: center;
  }
  
  h3 {
    font-size: 1.4rem;
    margin: 1.5rem 0 1rem;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.5rem;
  }
  
  .questions-section {
    margin-bottom: 2rem;
  }
  
  .questions-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .question-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }
  
  .question-item:hover {
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .question-content {
    flex: 1;
  }
  
  .question-text {
    display: block;
    margin-bottom: 0.75rem;
    color: white;
  }
  
  .options-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .option-item {
    background: rgba(92, 157, 237, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.9rem;
  }
  
  .correct-answer {
    color: #5cdb95;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 1rem;
  }
  
  .action-button.delete {
    background: rgba(255, 94, 125, 0.2);
    color: #ff5e7d;
  }
  
  .action-button.delete:hover {
    background: rgba(255, 94, 125, 0.3);
  }
  
  .add-question {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .question-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .form-input:focus {
    border-color: rgba(92, 157, 237, 0.5);
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 157, 237, 0.2);
  }
  
  .cta-button {
    display: block;
    width: 100%;
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 0.875rem;
    font-size: 1.125rem;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1.5rem;
    box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  }
  
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
  }
  
  .blur-circle {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
    filter: blur(80px);
    bottom: 20%;
    right: 10%;
    z-index: 0;
    animation: float 15s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(50px, 50px);
    }
  }
  
  @media (max-width: 768px) {
    .content-wrapper {
      padding: 100px 1.5rem 1.5rem;
    }
    
    .form-container {
      padding: 1.5rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    h3 {
      font-size: 1.2rem;
    }
    
    .question-item {
      flex-direction: column;
      gap: 1rem;
    }
    
    .action-button {
      width: 100%;
      margin-left: 0;
      margin-top: 1rem;
    }
    
    .blur-circle {
      width: 300px;
      height: 300px;
      filter: blur(60px);
    }
  }
  
  @media (max-width: 576px) {
    .form-container {
      padding: 1.25rem;
    }
    
    .option-item {
      font-size: 0.8rem;
    }
  }
  </style>