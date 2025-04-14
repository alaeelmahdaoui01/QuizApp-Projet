
<template>
    <NavBarAdmin :user="user" />
    <div class="create-quiz">
      <h2>Create Quiz from API</h2>
  
      <label>Category:</label>
      <select v-model="selectedCategory">
        <option v-for="(id, name) in categories" :key="id" :value="name">{{ name }}</option>
      </select>
  
      <label>Difficulty:</label>
      <select v-model="difficulty">
        <option>easy</option>
        <option>medium</option>
        <option>hard</option>
      </select>
  
      <label>Number of Questions:</label>
      <input v-model.number="amount" type="number" min="1" max="50" />
  
      <label>Quiz Title:</label>
      <input v-model="quizTitle" type="text" placeholder="Quiz title" />
  
      <button @click="createQuiz">Import and Save Quiz</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import 'firebase/auth';
  import NavBarAdmin from '@/components/NavBarAdmin.vue';

  
  export default {
    name: "CreateQuiz",
    components: {
      NavBarAdmin,
    },
    data() {
      return {
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
  .create-quiz {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    margin: 2rem auto;
  }
  
  input, select, button {
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  