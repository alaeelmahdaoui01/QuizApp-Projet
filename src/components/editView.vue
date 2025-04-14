<template>
    <NavBarAdmin :user="user" />
    <div class="edit-view">
      <h2>Edit Quiz</h2>
  
      <!-- Existing questions list -->
      <div v-if="quiz">
        <h3>Existing Questions</h3>
        <ul>
          <li v-for="(q, index) in quiz.questions" :key="index">
            <strong>{{ q.question }}</strong>
            <ul>
              <li v-for="(opt, i) in q.options" :key="i">{{ opt }}</li>
            </ul>
            <p>✅ Correct Answer: {{ q.correctAnswer }}</p>
            <button @click="deleteQuestion(index)">Delete</button>
          </li>
        </ul>
      </div>
  
      <!-- Add new question -->
      <div class="add-question">
        <h3>Add New Question</h3>
        <form @submit.prevent="addQuestion">
          <div>
            <label>Question:</label>
            <input type="text" v-model="newQuestion.question" required />
          </div>
          <div>
            <label>Options (comma-separated):</label>
            <input type="text" v-model="optionsInput" required />
          </div>
          <div>
            <label>Correct Answer:</label>
            <input type="text" v-model="newQuestion.correctAnswer" required />
          </div>
          <button type="submit">Add Question</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/Firebase/config';
  import { editQuiz } from '@/Firebase/Firestore/edit';
  import NavBarAdmin from '@/components/NavBarAdmin.vue';

  
  export default {
    name: 'EditView',
    components: {
      NavBarAdmin,
    },
    data() {
      return {
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
      await this.fetchQuiz();
    },
    methods: {
      async fetchQuiz() {
        try {
          const quizDoc = await db.collection('quizzes').doc(this.quizId).get();
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
  .edit-view {
    padding: 20px;
    max-width: 600px;
    margin: auto;
  }
  ul {
    padding-left: 20px;
  }
  form > div {
    margin-bottom: 10px;
  }
  button {
    margin-top: 10px;
  }
  </style>
  