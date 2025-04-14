<template>
    <NavbarSignedin :user="user" />
    <div class="home-container">
      <div class="home-panel">
        <h2 class="home-title" v-show="!search">Trending quizzes in your feed</h2>
        <h2 class="home-title" v-show="search">Search Results</h2>
        <router-link to="/createquiz" v-if="isAdmin" class="create-form-btn">Create New</router-link>
      </div>
      <div class="quizzes-container">
        <router-link
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :to="`/quiz/${quiz.id}`"
            class="quiz-card"
        >
            <div class="quiz-content">
                <div class="quiz-title" v-html="quiz.title"></div>
                <div class="quiz-creator">Created by {{ quiz.creatorName || 'Anonymous' }}</div>
                <div class="quiz-details">
                    {{ quiz.description }}<br />
                    <div class="quiz-stats">
                        <span>Difficulty: {{ quiz.difficulty }}</span>
                        <span>Questions: {{ quiz.questions.length }}</span>
                    </div>
                </div>
            </div>
        </router-link>

      </div>
      <div class="blur-circle"></div>
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
        filtered: [],
        search: false,
        filter: false,
        isAdmin: false,
        searchbar: true,
        user: {},
      };
    },
    computed: {
      filteredQuizzes() {
        return this.search || this.filter ? this.filtered : this.quizzes;
      },
    },
    methods: {
      quizhover(event, quiz) {
        const quizTitleElement = event.target.querySelector(".quiz-title");
        quizTitleElement.innerHTML =
          'Difficulty Level: ' + quiz.difficulty + '<br>' +
          quiz.description + '<br>' +
          'Number of Questions: ' + quiz.questions.length;
        quizTitleElement.style.mixBlendMode = "normal";
        quizTitleElement.style.textAlign = "left";
        quizTitleElement.style.fontSize = "12px";
        quizTitleElement.style.padding = "12px";
  
        event.target.querySelector(".quiz-image").style.display = "none";
        event.target.style.background = "linear-gradient(90deg, #ef42ba, #735def)";
      },
  
      quizregular(event, quiz) {
        const quizTitleElement = event.target.querySelector(".quiz-title");
        quizTitleElement.innerHTML = quiz.title;
        quizTitleElement.style.textAlign = "center";
        quizTitleElement.style.mixBlendMode = "difference";
        quizTitleElement.style.fontSize = "1.5em";
        quizTitleElement.style.padding = "0";
  
        event.target.querySelector(".quiz-image").style.display = "block";
        event.target.style.background = "#fefefe";
      },
  
      async getQuizList() {
        try {
          const { quizzes, load } = getQuizzes();
          await load();
          this.quizzes = quizzes.value;
        } catch (error) {
          console.log(error);
        }
      },
  
      handleSearch(filtered_quizzes) {
        this.search = true;
        this.filtered = filtered_quizzes;
      },
  
      handleFilter(filtered_quizzes) {
        this.filter = true;
        this.filtered = filtered_quizzes;
      },
    },
  };
  </script>
  

  <style scoped>
.home-container {
  position: relative;
  min-height: 100vh;
  background: #1a1a2e;
  color: white;
  padding-top: 80px;
  overflow-x: hidden;
}

.home-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.home-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(229, 46, 113, 0.3);
}

.create-form-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.create-form-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(118, 75, 162, 0.6);
}

.quizzes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 5%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.quiz-card {
  background: #16213e;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  height: 340px; /* Increased height for creator info */
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

.quiz-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.quiz-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
  transition: all 0.3s ease;
  line-height: 1.4;
}

.quiz-creator {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.quiz-creator::before {
  content: "👤";
  margin-right: 6px;
  font-size: 0.9rem;
}

.quiz-details {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-top: auto;
}

.quiz-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.quiz-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0 0 20px 20px;
  transition: all 0.4s ease;
}

.blur-circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.15), transparent 70%);
  filter: blur(80px);
  top: 20%;
  left: 10%;
  z-index: 0;
  animation: float 12s ease-in-out infinite alternate;
}

/* Responsive styles */
@media (max-width: 768px) {
  .home-panel {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .quizzes-container {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .quiz-card {
    height: 300px;
  }
}
</style>