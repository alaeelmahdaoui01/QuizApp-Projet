
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
        defaultPhoto: "https://th.bing.com/th/id/OIP.DQdhyRifE5tywz-uIlBKUAHaHa?rs=1&pid=ImgDetMain"  // Fallback image if photoURL is not available
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
  .navbar-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(30, 30, 47, 0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .brand {
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  .brand a {
    color: white;
    text-decoration: none;
    background: linear-gradient(to right, #ffffff, #c9d6ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transition: all 0.3s ease;
  }
  
  .buttons-container, .usermenu {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  
  .button {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .button:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
  
  .button.router-link-exact-active {
    color: white;
    background: linear-gradient(135deg, rgba(255, 94, 125, 0.2), rgba(255, 45, 95, 0.2));
  }
  
  .userphoto {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .userphoto:hover {
    transform: scale(1.1);
  }
  
  .username {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .username:hover {
    color: white;
  }
  
  /* Remove the underline effect from original design */
  .button::after {
    content: none;
  }
  
  @media (max-width: 768px) {
    .navbar {
      padding: 1rem;
    }
    
    .brand {
      font-size: 1.25rem;
    }
    
    .buttons-container, .usermenu {
      gap: 0.75rem;
    }
    
    .button {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
    
    .userphoto {
      width: 32px;
      height: 32px;
    }
  }
  </style>