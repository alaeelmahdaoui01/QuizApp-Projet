

<template>
    <br>
    <form @submit.prevent="resetPassword" class="reset">
      <input type="email" required placeholder="Your email" v-model="email"/>
      <input type="submit" value="Reset"/>
  
      <div class="message">{{ message }}</div>
    </form>
  </template>
  
  <script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  
  export default {
  name: "ResetPassword",
  components: {},
  data(){
    return {
      email : "", 
      message:"",
    }
  },
  methods :{
    resetPassword(){
      firebase.auth().sendPasswordResetEmail(this.email).then(()=>{
        this.message="If your account exists, you will receive an email"
      }).catch(err => {
          this.message=err.message
        })
    }
  }
  };
  
  </script>
  
  <style scoped>
  .reset {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .reset input[type="email"] {
    padding: 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .reset input[type="email"]:focus {
    border-color: rgba(92, 157, 237, 0.5);
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 157, 237, 0.2);
  }
  
  .reset input[type="email"]::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .reset input[type="submit"] {
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
  
  .reset input[type="submit"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 45, 95, 0.3);
  }
  
  .message {
    color: #5c9ded;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  .error {
    color: #ff5e7d;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 0.5rem;
  }
  </style>