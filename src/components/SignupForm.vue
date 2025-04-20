<template>
    <form @submit.prevent="handleSignUP" class="register">
      <h2></h2>
      <input type="text" required placeholder="Display name" v-model="displayName">
      <input type="email" required placeholder="Your email" v-model="email">
      <input type="password" required placeholder="Your password" v-model="password">
      <input type="submit" value="Sign up">
      <div class="error">{{ error }}</div>
    </form>
  </template>
  
  <script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import {app} from "../Firebase/config.js"
  
  export default {
    name: "SignupForm",
    components: {},
    data(){
      return {
        displayName: "",
        email : "", 
        password: "",
        error:"",
      }
    },
    methods :{
      async handleSignUP() {
    try {
      const firebaseAuth = firebase.auth();
      const createUser = await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password);
      const result = createUser;
      
      const dataBase = app.collection("users").doc(result.user.uid);
      this.error = "";
  
      await dataBase.set({
        createdAt: new Date(),
        displayName: this.displayName,
        email: this.email,
        role:"user",
        takenQuizzes:[], 
      });
  
      this.$router.push("/homeuser");
    } catch (err) {
      this.error = err.message; // This will show the error in your <div class="error">{{ error }}</div>
    }
  }
    }
  };
  </script>
  
  <style scoped>
  .register {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .register input[type="text"],
  .register input[type="email"],
  .register input[type="password"] {
    padding: 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .register input:focus {
    border-color: rgba(92, 157, 237, 0.5);
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 157, 237, 0.2);
  }
  
  .register input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .register input[type="submit"] {
    padding: 0.875rem;
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .register input[type="submit"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 45, 95, 0.3);
  }
  
  .error {
    color: #ff5e7d;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 0.5rem;
  }
  </style>