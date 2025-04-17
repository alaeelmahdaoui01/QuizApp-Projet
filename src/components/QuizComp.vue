<template>
    <div class="thread-container" v-if="quiz">
      <div class="thread-header">
        <h2>{{ quiz.title }}</h2>
        <p class="thread-info">
          Posted by <router-link :to="'/profile/' + quiz.createdBy">
            {{ quiz.createdBy || 'Loading...' }}
          </router-link>
        </p>
      </div>
      <div class="thread-content">
        <!-- Add quiz content here -->
        <p><strong>Topic:</strong> {{ quiz.topic }}</p>
        <p><strong>Difficulty:</strong> {{ quiz.difficulty }}</p>
      </div>
    </div>
    <div v-else class="loading-message">
      Loading quiz data...
    </div>
  </template>
  
  <script>

import { getUser } from "@/Firebase/Authentification/getUser.js";

  export default {
    name: 'QuizComp',
    data() {
      return {
        user:{},
        //authorName: ''
      };
    },
    async created() {
      const user = getUser();
      this.user = user;

    },
    async mounted() {
      if (this.quiz?.createdBy) {
        try {
          const user = await this.getuser(this.quiz.createdBy);
          this.authorName = user?.displayName || 'Anonymous';
        } catch (error) {
          console.error('Error fetching author:', error);
          this.authorName = 'Unknown';
        }
      }
    },
    methods: {
      async getuser(id) {
        const response = await fetch(`/api/users/${id}`); // Adjust to your actual API endpoint
        return response.json();
      }
    },
    props: {
      quiz: {
        type: Object,
        required: true
      }
    }
  };
  </script>

<style scoped>
.thread-container {
  background: rgba(46, 46, 72, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.thread-header h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #ffffff, #c9d6ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.thread-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

.thread-info a {
  color: #8a8aff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.thread-info a:hover {
  color: #a2a2ff;
}

.thread-content {
  margin-top: 1.5rem;
}

.thread-content p {
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.thread-content strong {
  color: #ff8a8a;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
}
</style>