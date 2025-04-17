
<template>
    <div class="quiz">
        <div class="home-signedin-container">
            
            <Quiz :quiz="mainQuiz" />
            <div class="reply-form">
                <button class="reply-button">Start Quiz</button>
            </div>
            <div class="blur-circle pink"></div>
            <div class="blur-circle blue"></div>
        </div>
    </div>
</template>
  
  <script>

 
  import Quiz from '@/components/QuizComp.vue';

  import { getUser } from '@/Firebase/Authentification/getUser';
  import { getquiz } from '@/Firebase/Firestore/getQuizInfo.js';

  
  
  export default {
    name: 'DiscussionView',
    components: {
      Quiz,
   
    },
    data() {
      return {
        mainQuiz: null,
        currentUserId: getUser()?.uid || null,
        user:{}
      };
    },
    async created() {
      await this.loadQuiz();
      const user = getUser();
      this.user = user;
      console.log(user);
    },
    methods: {
        async loadQuiz() {
            console.log("Loading quiz with ID:", this.$route.params.id); // Debug 1
            const { quiz, error, load } = getquiz(this.$route.params.id);
            await load();
            console.log("Quiz data:", quiz.value); // Debug 2
            console.log("Error:", error.value); // Debug 3
            this.mainQuiz = quiz.value;
            },
  
    }
  };
  </script>
  
  <style scoped>
.quiz {
  position: relative;
  min-height: 100vh;
  padding-top: 100px;
  background-color: #1e1e2f;
  color: white;
}

.discussion {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.reply-form {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.reply-button {
  background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
  color: white;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 50px;
  border: none;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.reply-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
}

.blur-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.6;
}

.blur-circle.pink {
  background: radial-gradient(circle, rgba(255, 110, 199, 0.3), transparent 70%);
  top: 20%;
  left: 10%;
  animation: float 15s ease-in-out infinite;
}

.blur-circle.blue {
  background: radial-gradient(circle, rgba(100, 108, 255, 0.3), transparent 70%);
  bottom: 10%;
  right: 10%;
  animation: float 18s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 30px);
  }
}

@media (max-width: 768px) {
  .discussion,
  .reply-form {
    padding: 1.5rem;
  }
  
  .thread-header h2 {
    font-size: 1.5rem;
  }
  
  .blur-circle {
    width: 300px;
    height: 300px;
    filter: blur(60px);
  }
}
</style>