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
          v-for="(quiz) in filteredQuizzes"
          :key="quiz.id"
          :to="`/quiz/${quiz.id}`"
          class="quiz-card"
          @mouseenter="(event) => quizhover(event, quiz)"
          @mouseleave="(event) => quizregular(event, quiz)"
        >
          <div class="quiz-title" v-html="quiz.title"></div>
          <img :src="quiz.url" class="quiz-image" />
        </router-link>
      </div>
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
  