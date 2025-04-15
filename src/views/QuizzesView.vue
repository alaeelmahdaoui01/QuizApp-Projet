<template>
    <div class="home-signedin-container">
      <NavbarSignedin :user="user" />
      <main class="content-wrapper">
        <div class="header-panel">
          <h2 class="section-title">All Available Quizzes</h2>
        </div>
  
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Search quizzes by name..." @input="applyFilters" />
          <select v-model="selectedDifficulty" @change="applyFilters">
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select v-model="selectedTopic" @change="applyFilters">
            <option value="">All Topics</option>
            <option v-for="topic in topics" :key="topic" :value="topic">{{ topic }}</option>
          </select>
        </div>
  
        <div class="quizzes-grid">
          <router-link
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :to="`/quiz/${quiz.id}`"
            class="quiz-card"
          >
            <div class="quiz-content">
              <h3 class="quiz-title">{{ quiz.title }}</h3>
              <div class="quiz-details">
                <div class="quiz-meta">
                  <span class="quiz-difficulty">{{ quiz.difficulty }}</span>
                  <span class="quiz-questions">{{ quiz.questions.length }} questions</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </main>
      <div class="blur-circle pink"></div>
      <div class="blur-circle blue"></div>
    </div>
  </template>
  
  <script>
  import NavbarSignedin from "@/components/NavBarUser.vue";
  import getQuizzes from "@/Firebase/Firestore/getQuizzes";
  import { getUser } from "@/Firebase/Authentification/getUser.js";
  import { app } from "@/Firebase/config";
  
  export default {
    name: "HomeSignedInView",
    components: {
      NavbarSignedin,
    },
    async created() {
      await this.getQuizList();
      const user = getUser();
      this.user = user;
      const userDoc = await app.collection("users").doc(user.uid).get();
      this.isAdmin = userDoc.data().role === "admin";
    },
    data() {
      return {
        quizzes: [],
        searchQuery: "",
        selectedDifficulty: "",
        selectedTopic: "",
        topics: [],
        user: {},
      };
    },
    computed: {
      filteredQuizzes() {
        return this.quizzes.filter((quiz) => {
          const matchesTitle = quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesDifficulty = this.selectedDifficulty ? quiz.difficulty === this.selectedDifficulty : true;
          const matchesTopic = this.selectedTopic ? quiz.topic === this.selectedTopic : true;
          return matchesTitle && matchesDifficulty && matchesTopic;
        });
      },
    },
    methods: {
      async getQuizList() {
        try {
          const { quizzes, load } = getQuizzes();
          await load();
          this.quizzes = quizzes.value;
          this.extractTopics();
        } catch (error) {
          console.log(error);
        }
      },
      extractTopics() {
        const topicSet = new Set();
        this.quizzes.forEach((quiz) => {
          if (quiz.topic) {
            topicSet.add(quiz.topic);
          }
        });
        this.topics = Array.from(topicSet);
      },
      applyFilters() {
        // This is just a trigger for computed property to re-evaluate
      },
    },
  };
  </script>
  
   
    
  <style scoped>
  
  
  .home-signedin-container {
    position: relative;
    min-height: 100vh;
    background-color: #1e1e2f;
    color: white;
    overflow: hidden;
  }
  
  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 100px 2rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .header-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
    background: linear-gradient(to right, #ff8a8a, #ff2d5f);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 10px rgba(255, 45, 95, 0.3);
  }
  
  .cta-button {
    display: inline-block;
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
    background: linear-gradient(135deg, #ff2d5f 0%, #ff5e7d 100%);
  }
  
  .quizzes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
  }
  
  .quiz-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
  }
  
  .quiz-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #ff5e7d, #ff2d5f);
    transition: all 0.3s ease;
  }
  
  .quiz-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 25px rgba(255, 45, 95, 0.2);
    border-color: rgba(255, 94, 125, 0.3);
  }
  
  .quiz-card:hover::before {
    width: 6px;
  }
  
  .quiz-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }


  
  .quiz-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: white;
    position: relative;
    padding-left: 1rem;
  }
  
  .quiz-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: #ff5e7d;
    border-radius: 50%;
  }

  .quiz-title::before {
  content: none; /* Simplement masquer le point */
}
  
  .quiz-creator {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }
  
  .quiz-details {
    margin-top: auto;
  }
  
  .quiz-description {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
  
  .quiz-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .quiz-difficulty {
    color: #ff8a8a;
  }
  
  .quiz-questions {
    color: #8a8aff;
  }
  
  .blur-circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    animation: float 15s ease-in-out infinite;
  }
  
  .blur-circle.pink {
    background: radial-gradient(circle, rgba(255, 94, 125, 0.2), transparent 70%);
    top: 20%;
    left: 10%;
  }
  
  .blur-circle.blue {
    background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
    bottom: 10%;
    right: 10%;
    animation-delay: 2s;
    animation-direction: reverse;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(50px, 50px);
    }
  }
  
  @media (max-width: 992px) {
    .quizzes-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
  
  @media (max-width: 768px) {
    .content-wrapper {
      padding: 100px 1.5rem 1.5rem;
    }
    
    .header-panel {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
    
    .blur-circle {
      width: 300px;
      height: 300px;
      filter: blur(60px);
    }
  }
  
  @media (max-width: 576px) {
    .quizzes-grid {
      grid-template-columns: 1fr;
    }
    
    .quiz-card {
      padding: 1.25rem;
    }
  }

  .welcome-message {
  text-align: center;
  z-index: 1;
  max-width: 800px;
  margin-bottom: 2rem;
  margin-left: 260px
}

.welcome-message h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.welcome-message p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
  flex-wrap: wrap;
}

.search-bar input,
.search-bar select {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-bar input {
  min-width: 300px;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-bar input:focus,
.search-bar select:focus {
  outline: none;
  border-color: rgba(255, 94, 125, 0.5);
  box-shadow: 0 0 0 2px rgba(255, 94, 125, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.search-bar select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-bar input,
  .search-bar select {
    width: 100%;
    min-width: auto;
  }
}
  </style>