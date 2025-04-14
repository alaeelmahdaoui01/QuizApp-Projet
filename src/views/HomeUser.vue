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
                <div class="quiz-details">
                Difficulty: {{ quiz.difficulty }}<br />
                {{ quiz.description }}<br />
                Questions: {{ quiz.questions.length }}
                </div>
            </div>
            <img :src="quiz.url" class="quiz-image" />
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
  background-color: #1e1e2f;
  color: white;
  padding-top: 70px;
  overflow: hidden;
}

.home-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-title {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(to right, #ffffff, #c9d6ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.create-form-btn {
  background: linear-gradient(135deg, #ff5e7d, #ff2d5f);
  color: white;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 30px;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.create-form-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
}

.quizzes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Quiz card style */
.quiz-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fefefe;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: relative;
  padding: 1rem;
  width: 240px;
  height: 300px;
}

.quiz-card:hover {
  background: linear-gradient(90deg, #ef42ba, #735def);
  transform: scale(1.03);
}

.quiz-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}

.quiz-card:hover .quiz-image {
  opacity: 0;
  pointer-events: none;
}

.quiz-title {
  padding: 1rem;
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  mix-blend-mode: difference;
  transition: all 0.3s ease;
}

.quiz-card:hover .quiz-title {
  font-size: 1em;
  text-align: left;
  mix-blend-mode: normal;
}

.quiz-details {
  display: none;
  font-size: 0.85em;
  color: white;
  text-align: left;
  padding: 0.5rem;
  z-index: 2;
}

.quiz-card:hover .quiz-details {
  display: block;
}

/* Optional blur effect */
.blur-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
  filter: blur(80px);
  top: 20%;
  left: 5%;
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

/* Responsive */
@media (max-width: 768px) {
  .home-title {
    font-size: 1.4rem;
  }

  .create-form-btn {
    font-size: 0.95rem;
    padding: 0.6rem 1.2rem;
  }

  .quiz-title {
    font-size: 1.2em;
  }

  .quiz-image {
    height: 130px;
  }

  .quiz-card {
    border-radius: 12px;
  }
}


</style>
