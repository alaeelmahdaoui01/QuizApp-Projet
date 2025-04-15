<template>
  <div class="admin-container">
    <NavBarAdmin :user="user" />
    <main class="content-wrapper">
      <div class="quizzes-container">
        <h2>Your Quizzes</h2>
        
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else-if="quizzes.length === 0" class="empty-state">
          <p>No quizzes created yet.</p>
          <router-link to="/create-quiz" class="cta-button">Create Your First Quiz</router-link>
        </div>
        
        <ul v-else class="quizzes-list">
          <li v-for="quiz in quizzes" :key="quiz.id" class="quiz-item">
            <div class="quiz-info">
              <h3 class="quiz-title">{{ quiz.title }}</h3>
              <div class="quiz-meta">
                <span class="quiz-category">{{ quiz.category }}</span>
                <span class="quiz-difficulty">Difficulty: {{ quiz.difficulty }}</span>
                <span class="quiz-questions">{{ quiz.questions.length }} questions</span>
              </div>
            </div>
            <div class="quiz-actions">
              <button @click="editQuiz(quiz.id)" class="action-button edit">Edit</button>
              <button @click="deleteQuiz(quiz.id)" class="action-button delete">Delete</button>
            </div>
          </li>
        </ul>
      </div>
    </main>
    <div class="blur-circle"></div>
  </div>
</template>

  <script>
  import { getUser , waitForAuthInit } from '@/Firebase/Authentification/getUser';  // Import the getUser method
  import { getQuizzes } from '../Firebase/Firestore/getQuiz'; 
  import NavBarAdmin from '@/components/NavBarAdmin.vue';
  import { deleteQuiz } from '@/Firebase/Firestore/delete';
  //import { editQuiz } from '@/Firebase/Firestore/edit';




  
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
  .admin-container {
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
  
  .quizzes-container {
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
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #ff5e7d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    color: #ff5e7d;
    padding: 1.5rem;
    text-align: center;
    background: rgba(255, 94, 125, 0.1);
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .quizzes-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .quiz-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }
  
  .quiz-item:hover {
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .quiz-info {
    flex: 1;
  }
  
  .quiz-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: white;
  }
  
  .quiz-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .quiz-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .action-button.edit {
    background: rgba(92, 157, 237, 0.2);
    color: #5c9ded;
  }
  
  .action-button.edit:hover {
    background: rgba(92, 157, 237, 0.3);
  }
  
  .action-button.delete {
    background: rgba(255, 94, 125, 0.2);
    color: #ff5e7d;
  }
  
  .action-button.delete:hover {
    background: rgba(255, 94, 125, 0.3);
  }
  
  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 0.875rem 2rem;
    font-size: 1.125rem;
    font-weight: 500;
    border-radius: 50px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    margin-top: 1.5rem;
  }
  
  .cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
  }
  
  .blur-circle {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
    filter: blur(80px);
    top: 20%;
    left: 10%;
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
    
    .quizzes-container {
      padding: 1.5rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .quiz-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .quiz-actions {
      width: 100%;
      justify-content: flex-end;
    }
    
    .blur-circle {
      width: 300px;
      height: 300px;
      filter: blur(60px);
    }
  }
  
  @media (max-width: 576px) {
    .quiz-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .quiz-actions {
      justify-content: space-between;
      width: 100%;
    }
  }
  </style>