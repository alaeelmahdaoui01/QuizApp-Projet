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
        <p> <strong>Time of creation: </strong>{{ formattedDate }}</p>
        <p> <strong>Number of questions: </strong>{{ questionCount }} questions</p>
        <p><strong>Topic:</strong> {{ quiz.topic }}</p>
        <p><strong>Difficulty:</strong> {{ quiz.difficulty }}</p>
      </div>

      <div class="passquiz">
                <router-link :to="`/quizpass/${quiz.id}`" class="quiz-card">
                    <button class="start-btn">Start Quiz</button> </router-link>
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
    },
    computed: {
    formattedDate() {
      if (!this.quiz.createdAt) return 'Recently created';
      
      const date = this.quiz.createdAt.toDate(); // If using Firebase Timestamp
      // const date = new Date(this.quiz.createdAt); // If using ISO string
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    questionCount() {
      return this.quiz.questions?.length || 0;
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
    margin-top: 50px;

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
.quiz-info {
  margin-bottom: 1.5rem;
}

.quiz-meta {
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.created-at::before {
  content: "📅 ";
}

.questions-count::before {
  content: "❓ ";
}

@media (max-width: 768px) {
  .quiz-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
.passquiz{
    margin-top : 40px
}
</style>