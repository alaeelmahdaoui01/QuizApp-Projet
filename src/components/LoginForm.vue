<template>
    <form @submit.prevent="handleLogin" class="login">
      <input type="email" required placeholder="Your email" v-model="email">
      <input type="password" required placeholder="Your password" v-model="password">
      <input type="submit" value="Login">
      <div class="error">{{ error }}</div>
    </form>
  </template>
  
  <script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  
  export default {
    name: "LoginForm",
    components: {},
    data(){
      return {
        email : "", 
        password: "",
        error:""
      }
    },
    methods: {
  handleLogin() {
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(async (cred) => {
        this.error = "";

        // Fetch user role from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(cred.user.uid).get();

        if (userDoc.exists) {
          const role = userDoc.data().role;

          if (role === "admin") {
            this.$router.push("/homeadmin");
          } else if (role === "user") {
            this.$router.push("/homeuser");
          } else {
            this.error = "Unknown user role.";
          }
        } else {
          this.error = "User data not found.";
        }
      })
      .catch(err => {
        if (err.code === 'auth/user-not-found') {
          this.error = "No account found with this email.";
        } else if (err.code === 'auth/wrong-password') {
          this.error = "Incorrect password.";
        } else {
          this.error = err.message;
        }
      });
  }
}

  };
  </script>
    
  <style scoped>
  .login {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .login input[type="email"],
  .login input[type="password"] {
    padding: 0.875rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .login input[type="email"]:focus,
  .login input[type="password"]:focus {
    border-color: rgba(92, 157, 237, 0.5);
    outline: none;
    box-shadow: 0 0 0 2px rgba(92, 157, 237, 0.2);
  }
  
  .login input[type="email"]::placeholder,
  .login input[type="password"]::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  .login input[type="submit"] {
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
  
  .login input[type="submit"]:hover {
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