
<template>
    <div class="discussion">
      <Quiz :quiz="mainQuiz" />
  
      
  
      <div class="reply-form">
        
        <button class="reply-button">Reply</button>
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
      };
    },
    async created() {
      await this.loadQuiz();
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
  .discussion {
    background-color: #fafafa;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    padding: 20px;
  }
  
  .replies {
    margin-top: 20px;
  }
  
  .replies h3 {
    font-size: 16px;
    margin-bottom: 10px;
    color: #262626;
  }
  
  .reply-form {
    margin-top: 20px;
  }
  
  .reply-form h3 {
    font-size: 16px;
    margin-bottom: 10px;
    color: #262626;
  }
  
  .reply-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #dbdbdb;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .reply-button {
    background-color: rgb(245, 66, 101);
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .reply-button:hover {
    background-color: rgb(189, 28, 60);
  }
  </style>
  