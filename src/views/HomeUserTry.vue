<template>
    <NavbarSignedin :searchbar="searchbar" :quizzes="quizzes" @search="handleSearch" @filter="handleFilter" />
    <div class="home-container">
      <div class="home-panel">
        <h2 class="home-title" v-show="!search">Trending quizzes in your feed</h2>
        <h2 class="home-title" v-show="search">Search Results</h2>
        <router-link to="/createquiz" v-if="isAdmin" class="create-form-btn">Create New</router-link>
      </div>
      <div class="quizzes-container">
        <router-link v-for="(quiz, index) in filteredQuizzes" :key="index" :to="`/quiz/${quiz.id}`" class="quiz-card"
          @mouseenter="(event) => quizhover(event, index)" @mouseleave="(event) => quizregular(event, index)">
          <div class="quiz-title" v-html="quiz.title"></div>
          <img :src="quiz.url" class="quiz-image" />
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import NavbarSignedin from "@/components/NavBarUser.vue";
  //import addQuizzesToFirestore from "@/composables/data";
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
      const userRole = (await app.collection("users").doc(user.uid).get()).data().role;
      this.isAdmin = userRole === "admin";
    },
    data() {
      return {
        quizzes: [],
        filtered: [],
        search: false,
        filter: false,
        isAdmin: false,
        searchbar: true,
      }
    },
    computed: {
      filteredQuizzes() {
        return this.search || this.filter ? this.filtered : this.quizzes;
      }
    },
    methods: {
      quizhover(event, index) {
        const quiz = this.quizzes[index];
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
  
      quizregular(event, idx) {
        const quiz = this.quizzes[idx];
        const quizTitleElement = event.target.querySelector(".quiz-title");
        quizTitleElement.innerHTML = quiz.title;
        quizTitleElement.style.textAlign = "center";
        quizTitleElement.style.mixBlendMode = "difference";
        quizTitleElement.style.fontSize = "1.5em";
        event.target.querySelector(".quiz-image").style.display = "block";
        event.target.style.background = "#fefefe";
      },
      async getQuizList() {
        try {
          const { quizzes, error, load } = getQuizzes();
          await load();
          this.quizzes = quizzes.value;
        }
        catch (error) {
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
      }
    }
  };
  </script>
  
  <style scoped>
  .home-container {
    margin-top: 100px;
  }
  
  .home-title {
    text-align: left;
    font-weight: 700;
    background: -webkit-linear-gradient(0deg, #735def, #a51eb7);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 10px 30px 20px 30px;
  }
  
  .home-panel {
    display: flex;
    align-items: baseline;
  }
  
  .quizzes-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    gap: 20px;
    width: 100%;
  }
  
  .quiz-card {
    position: relative;
    background-color: #fefefe;
    border: 2px solid #735def;
    border-radius: 10px;
    padding: 15px;
    width: 300px;
    height: 200px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
    text-align: center;
    cursor: pointer;
  }
  
  .quiz-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    background: linear-gradient(90deg, #ef42ba, #735def);
  }
  
  .quiz-title {
    position: absolute;
    font-size: 1.5em;
    font-weight: 600;
    color: #fff;
    mix-blend-mode: difference;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 100%;
    transition: font-size 0.3s ease, mix-blend-mode 0.3s ease;
  }
  
  .quiz-card:hover .quiz-title {
    mix-blend-mode: normal;
    font-size: 12px;
  }
  
  .quiz-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    filter: blur(3px);
    transition: display 0.3s ease;
  }
  
  .quiz-card:hover .quiz-image {
    display: none;
  }
  
  .create-form-btn {
    text-decoration: none;
    background-color: #F59931;
    color: #ffffff;
    padding: 8px 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
    margin-top: 20px;
  }
  
  .create-form-btn:hover {
    background-color: #cb42d4;
  }
  
  .create-form-btn:active {
    background-color: #8259ec;
  }
  
  @media (max-width: 600px) {
    .quizzes-container {
      flex-direction: column;
      align-items: center;
    }
  
    .quiz-card {
      width: 90%;
    }
  }
  </style>
  