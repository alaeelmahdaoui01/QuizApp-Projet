<template>
    <div class="create-quiz-container">
      helloo
      <NavBarAdmin :user="user" />
      <main class="content-wrapper">
        <div class="form-container">
          <h2>Create Quiz from API</h2>
          
          <div class="form-group">
            <label>Category:</label>
            <select v-model="selectedCategory" class="form-input">
              <option v-for="(id, name) in categories" :key="id" :value="name">{{ name }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Difficulty:</label>
            <select v-model="difficulty" class="form-input">
              <option>easy</option>
              <option>medium</option>
              <option>hard</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Number of Questions:</label>
            <input v-model.number="amount" type="number" min="1" max="50" class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Quiz Title:</label>
            <input v-model="quizTitle" type="text" placeholder="Quiz title" class="form-input" />
          </div>
          
          <button @click="createQuiz" class="cta-button">Import and Save Quiz</button>
          <p v-if="message" class="message">{{ message }}</p>
        </div>
      </main>
      <div class="blur-circle"></div>
    </div>
  </template>
  
<script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import 'firebase/auth';
  import NavBarAdmin from '@/components/NavBarAdmin.vue';
  import { getUser , waitForAuthInit } from '@/Firebase/Authentification/getUser';

  
  export default {
    name: "CreateQuiz",
    components: {
      NavBarAdmin,
    },
    data() {
      return {
        user : "",
        selectedCategory: "Computers",
        difficulty: "easy",
        amount: 10,
        quizTitle: "",
        message: "",
        categories: {
          "General Knowledge": 9,
          "Books": 10,
          "Film": 11,
          "Music": 12,
          "Science & Nature": 17,
          "Computers": 18,
          "Mathematics": 19,
          "Geography": 22,
          "History": 23,
          "Sports": 21
        }
      };
    },
    async created() {
        try {
          await waitForAuthInit();
          this.user = getUser();
          
          if (!this.user) {
            console.warn('User not authenticated');
            // Redirect to login if needed
            this.$router.push('/login');
            return;
          }
          
          await this.fetchQuizzes();
        } catch (error) {
          console.error('Error in HomeAdmin created hook:', error);
        }
      },
    methods: {
      async createQuiz() {
        this.message = "";
  
        try {
          const user = firebase.auth().currentUser;
          if (!user) {
            this.message = "You must be logged in.";
            return;
          }
  
          const userRef = firebase.firestore().collection("users").doc(user.uid);
          const userSnap = await userRef.get();
          if (!userSnap.exists || userSnap.data().role !== "admin") {
            this.message = "Unauthorized. Only admins can create quizzes.";
            return;
          }
  
          const categoryId = this.categories[this.selectedCategory];
  
          const apiUrl = `https://opentdb.com/api.php?amount=${this.amount}&category=${categoryId}&difficulty=${this.difficulty}&type=multiple`;
          const response = await fetch(apiUrl);
          const data = await response.json();
  
          if (!data.results.length) {
            this.message = "No questions found.";
            return;
          }
  
          const quiz = {
            title: this.quizTitle || "Untitled Quiz",
            topic: this.selectedCategory,
            difficulty: this.difficulty,
            createdBy: user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            questions: data.results.map(q => ({
              question: q.question,
              options: this.shuffle([...q.incorrect_answers, q.correct_answer]),
              correctAnswer: q.correct_answer
            }))
          };
  
          const quizRef = await firebase.firestore().collection("quizzes").add(quiz);
  
          await userRef.update({
            quizzes: firebase.firestore.FieldValue.arrayUnion({
              id: quizRef.id,
              title: quiz.title
            })
          });
  
          this.message = "Quiz created successfully!";
          this.quizTitle = "";
        } catch (err) {
          console.error(err);
          this.message = "Error: " + err.message;
        }
      },
  
      shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
      }
    }
  };
  </script>


<style scoped>
  .create-quiz-container {
    position: relative;
    min-height: 100vh;
    background-color: #1e1e2f;
    color: white;
    overflow: hidden;
  }
  
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 2rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .form-container {
    max-width: 600px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #ffffff, #c9d6ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group input {
    width : 570px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .form-input {
    width: 100%;
    padding: 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .form-input:focus {
    border-color: rgba(92, 157, 237, 0.5);
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 157, 237, 0.2);
  }
  
  .form-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .cta-button {
    display: block;
    width: 100%;
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 0.875rem;
    font-size: 1.125rem;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1.5rem;
    box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
  }
  
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
  }
  
  .message {
    text-align: center;
    margin-top: 1.5rem;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.95rem;
  }
  
  .message {
    color: #ff5e7d;
  }
  
  .blur-circle {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
    filter: blur(80px);
    bottom: 20%;
    right: 10%;
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
  
  @media (max-width: 768px) {
    .content-wrapper {
      padding: 100px 1.5rem 1.5rem;
    }
    
    .form-container {
      padding: 1.5rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .blur-circle {
      width: 300px;
      height: 300px;
      filter: blur(60px);
    }
  }
  
  @media (max-width: 576px) {
    .form-container {
      padding: 1.25rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
  }
  </style>


 