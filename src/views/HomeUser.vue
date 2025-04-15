<template>
  <div class="home-signedin-container">
    <NavbarSignedin :user="user" />
    <main class="content-wrapper">
      <div class="welcome-message">
        <h1>Welcome to our Quiz App!</h1>
        <p>Explore a world of quizzes designed to challenge and entertain you.</p>
        <p v-if="quizzes.length > 0">
          Dive into the latest quiz: <b>{{ quizzes[0].title }}</b>.
        </p>
      </div>
    <br><br><br><br><br><br>
      <div class="header-panel">
        <h2 class="section-title">Explore the latest quizzes</h2>

      </div>

      <div class="quizzes-grid">
        <router-link
          v-for="quiz in quizzes"
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
      filtered: [],
      search: false,
      filter: false,
      //isAdmin: false,
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
        this.quizzes = quizzes.value.splice(0,3); // show the 3 latest quizzes
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
  </style>