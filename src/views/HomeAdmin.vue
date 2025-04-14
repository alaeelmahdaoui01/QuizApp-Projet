<template>
    <div class="home-admin">
      <NavBarAdmin :user="user" />
      <div class="quizzes-list">
        <h2>Your Quizzes</h2>
        <div v-if="quizzes.length === 0">No quizzes created yet.</div>
        <ul v-else>
          <li v-for="quiz in quizzes" :key="quiz.id">
            <div>
              <strong>{{ quiz.title }}</strong> - {{ quiz.category }} - 
              Difficulty: {{ quiz.difficulty }} - 
              Number of Questions: {{ quiz.questions.length }}
            </div>
            <div class="actions">
              <button @click="editQuiz(quiz.id)">Edit</button>
              <button @click="deleteQuiz(quiz.id)">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { getUser } from '@/Firebase/Authentification/getUser';  // Import the getUser method
  import { getQuizzes } from '../Firebase/Firestore/getQuiz'; 
  import NavBarAdmin from '@/components/NavBarAdmin.vue';
  
  export default {
    name: 'HomeAdmin',
    components: {
      NavBarAdmin,
    },
    data() {
      return {
        user: null, // Will be set based on authentication state
        quizzes: [], // To store fetched quizzes
      };
    },
    async created() {
      // Fetch the user and quizzes
      this.user = getUser();  // Use getUser.js to track the current user
      if (this.user) {
        await this.fetchQuizzes();  // Only fetch quizzes if the user is logged in
      }
    },
    methods: {
      async fetchQuizzes() {
        const quizzes = await getQuizzes(); // Fetch quizzes from Firestore
        this.quizzes = quizzes;
      },
      editQuiz(quizId) {
        console.log('Edit quiz', quizId);
        // Add edit functionality here later
      },
      deleteQuiz(quizId) {
        console.log('Delete quiz', quizId);
        // Add delete functionality here later
      },
    },
  };
  </script>
  
  <style scoped>
  .quizzes-list {
    padding: 20px;
  }
  
  .actions {
    margin-top: 10px;
  }
  
  button {
    margin-right: 10px;
  }
  </style>
  