<template>
    <div class="home-signedin-container">
      <NavbarSignedin :user="user" />
      <main class="content-wrapper">
        <div class="quiz-container" v-if="quiz">
            <div class="quiz-header">
                <h2>{{ quiz.title }}</h2>
                <p class="quiz-info">Posted by <router-link :to="'/profile/' + quiz.createdBy"> {{ authorName }} </router-link></p>
            </div>
            
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
        user: {},
      };
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
      
    },
  };
  </script>
  