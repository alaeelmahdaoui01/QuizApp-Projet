<template>
    <div class="auth-container">
      <NavBar />
      <div class="auth-content">
        <div class="auth-form-wrapper">
          <div class="form-container">
            <h2 v-if="resetp">Reset Password</h2>
            <h2 v-else-if="showLogin">Login</h2>
            <h2 v-else>Sign up</h2>
            
            <div v-if="resetp">
              <div class="auth-navigation">
                Back to <span @click="showLogin = true; resetp=false">Login</span>
              </div>
              <ForgotPassword />
            </div>
            <div v-else-if="showLogin">
              <LoginForm />
              <p class="auth-navigation">No account yet? <span @click="showLogin = false">Signup</span> instead.</p>
              <p class="auth-navigation">Forgot Password? <span @click="resetp = true">Reset Password</span></p>
            </div>
            <div v-else>
              <SignupForm />
              <p class="auth-navigation">Already registered? <span @click="showLogin = true">Login</span> instead.</p>
            </div>
          </div>
        </div>
        
        <div class="auth-side-content">
            <h1>Ready to Test Your Knowledge?</h1>
            <p>Log in to access exciting quizzes and track your progress.</p>
            <p>Challenge yourself and learn something new every day!</p>
        </div>
      </div>
      <div class="blur-circle"></div>
    </div>
  </template>
  
  <script>
  import NavBar from '../components/NavBar.vue';
  import SignupForm from '../components/SignupForm.vue';
  import LoginForm from '../components/LoginForm.vue';
  import ForgotPassword from '../components/ForgotPassword.vue';
  
  export default {
    components: { NavBar, SignupForm, LoginForm, ForgotPassword },
    data() {
      return {
        showLogin: true,
        resetp: false,
      };
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    position: relative;
    min-height: 100vh;
    background-color: #1e1e2f;
    overflow: hidden;
  }
  
  .auth-content {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 2rem 2rem;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
    position: relative;
  }
  
  .auth-form-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
  
  .form-container {
    width: 100%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #ffffff, #c9d6ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .auth-navigation {
    color: rgba(255, 255, 255, 0.7);
    margin-top: 1.5rem;
    font-size: 0.95rem;
  }
  
  .auth-navigation span {
    color: #ff5e7d;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .auth-navigation span:hover {
    color: #ff2d5f;
    text-decoration: underline;
  }
  
  .auth-side-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
  }
  
  .auth-side-content h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #ffffff, #c9d6ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  .auth-side-content p {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 1rem;
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
  
  @media (max-width: 992px) {
    .auth-content {
      flex-direction: column;
      padding-top: 100px;
    }
    
    .auth-side-content {
      text-align: center;
      padding: 2rem 1rem;
    }
    
    .form-container {
      padding: 2rem;
    }
    
    .blur-circle {
      width: 300px;
      height: 300px;
      bottom: 10%;
      right: 5%;
    }
  }
  
  @media (max-width: 576px) {
    .form-container {
      padding: 1.5rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .auth-side-content h1 {
      font-size: 2rem;
    }
  }
  </style>