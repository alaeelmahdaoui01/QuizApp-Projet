<template>
    <div class="navbar-container">
      <nav class="navbar">
        <div class="buttons-container">
          <router-link to="/homeadmin" class="button">Home</router-link>
          <router-link to="/create" class="button">Create</router-link>
          
        </div>
        <div class="usermenu">
          <!-- Use optional chaining to prevent errors when user is null -->
          <router-link :to="'/profile/' + user?.uid" class="username">
            <img :src="defaultPhoto" class="userphoto" />
          </router-link>
          <button class="button" @click="leave">Sign out</button>
        </div>
      </nav>
    </div>
  </template>
  
  <script>
  import signOut from '@/Firebase/Authentification/SignOut';
  
  export default {
    name: 'NavBarAdmin',
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        defaultPhoto: "https://www.example.com/default-avatar.jpg"  // Fallback image if photoURL is not available
      };
    },
    methods: {
      leave() {
        signOut();
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>


  .buttons-container a,.button{
    font-weight: bold;
  }
  .navbar-container {
    text-align: center;
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background-color: #000000;
    color: #fff;
    height: 60px;
  }
  
  /* Ensures buttons and user menu are aligned properly */
  .buttons-container,
  .usermenu {
    display: flex;
    align-items: center;
  }
  
  /* Optional spacing between left buttons */
  .buttons-container .button:not(:last-child) {
    margin-right: 10px;
  }
  
  .usermenu {
    gap: 10px;
  }
  
  .userphoto {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .username {
    text-decoration: none;
    color: #fff;
    font-weight: bold;
  }
  
  .button {
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;
  }
  
  /* Adds a white underline glow on hover */
  .button::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 3px;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  .button:hover::after {
    transform: scaleX(1);
  }
  
  /* Hover color + lift effect */
  .button:hover {
    color: #ccc;
    transform: translateY(-2px);
  }
  
  
  .button:focus {
    outline: none;
  }
  
  .navbar {
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
  }
  
    
    </style>
    
  