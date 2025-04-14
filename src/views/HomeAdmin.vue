<template>
    <div class="home-admin">
      <NavBarAdmin :user="user" />
      <div class="quizzes-list">
        <h2>Your Quizzes</h2>
        <div v-if="loading">Loading quizzes...</div>
        <div v-else-if="error" class="error">{{ error }}</div>

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
  import { getUser , waitForAuthInit } from '@/Firebase/Authentification/getUser';  // Import the getUser method
  import { getQuizzes } from '../Firebase/Firestore/getQuiz'; 
  import NavBarAdmin from '@/components/NavBarAdmin.vue';
  import { deleteQuiz } from '@/Firebase/Firestore/delete';
import { editQuiz } from '@/Firebase/Firestore/edit';




  
  export default {
    name: 'HomeAdmin',
    components: {
      NavBarAdmin,
    },
    data() {
    return {
    user: null,
    quizzes: [],
    loading: true,
    error: null
      };
    },

    
    async created() {
        try {
          await waitForAuthInit();
          this.user = getUser();
          
          if (!this.user) {
            console.warn('User not authenticated');
            // Redirect to login if needed
            this.$router.push('/login');
            return;
          }
          
          await this.fetchQuizzes();
        } catch (error) {
          console.error('Error in HomeAdmin created hook:', error);
        }
      },
    methods: {
      // In HomeAdmin component
      async fetchQuizzes() {
      this.loading = true;
      this.error = null;
      try {
        if (!this.user || !this.user.uid) {
          throw new Error('No user UID available');
        }
        this.quizzes = await getQuizzes(this.user.uid);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        this.error = 'Failed to load quizzes';
      } finally {
        this.loading = false;
      }
    },
      
      async deleteQuiz(quizId) {
          try {
            await deleteQuiz(quizId);
            this.fetchQuizzes(); // Refresh list after deletion
          } catch (error) {
            alert('Error deleting quiz');
          }
    },

    editQuiz(quizId) {
  this.$router.push({ name: 'EditQuiz', params: { id: quizId } });
}
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
  