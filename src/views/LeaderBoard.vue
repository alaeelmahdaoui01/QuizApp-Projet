<template>
    <div class="home-signedin-container">
      <main class="content-wrapper">
        <div class="header-panel">
            <button class="home-button" @click="goToHome">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Return to Home page
            </button>
          <h2 class="section-title">🏆 Quiz Leaderboard</h2>
        </div>
  
        <div class="leaderboard-container">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in allUsers" :key="user.uid">
               
                <td>{{ index + 1 }}</td>
                <td>
                  <router-link :to="`/profile/${user.uid}`" class="user-link">
                    {{ user.displayName }}
                  </router-link>
                </td>
                <td>{{ user.totalScore }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <div class="blur-circle pink"></div>
      <div class="blur-circle blue"></div>
    </div>
  </template>
  
  <script>

  import { getUser } from "@/Firebase/Authentification/getUser.js";
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
  export default {
    name: 'LeaderboardView',
    data() {
      return {
        allUsers: [],
        user: {}
      };
    },
    methods: {
      goToHome() {
        this.$router.push('/homeuser');
      }
    },
   
    async mounted() {
  const usersRef = firebase.firestore().collection("users");
  const snapshot = await usersRef.get();

  const usersWithScores = snapshot.docs
    .map(doc => {
      const data = doc.data();
      const totalScore = (data.quizzes || []).reduce((sum, q) => sum + (q.score || 0), 0);

      return {
        uid: doc.id,
        displayName: data.displayName || "Anonymous",
        totalScore,
        role: data.role || "user"  // Default to user if role isn't set
      };
    })
    .filter(user => user.role !== "admin");  // Exclude admins

  // Sort all users by total score
  this.allUsers = usersWithScores.sort((a, b) => b.totalScore - a.totalScore);
}
  };
  </script>
  
  <style scoped>
  .home-signedin-container {
    position: relative;
    min-height: 100vh;
    background-color: #1e1e2f;
    color: white;
    overflow: hidden;
  }
  
  .content-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 100px 2rem 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .header-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0 1rem;
    position: relative;
  }
  
  .section-title {
    font-size: 1.8rem;
    background: linear-gradient(to right, #ff8a8a, #ff2d5f);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 10px rgba(255, 45, 95, 0.3);
    margin: 0 auto;
  }
  
  .home-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: absolute;
    left: 1rem;
    z-index: 1;
  }
  
  .home-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-3px);
  }
  
  .leaderboard-container {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    margin: 0 auto;
    max-width: 800px;
    position: relative;
    overflow: hidden;
  }
  
  .leaderboard-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, #ff5e7d, #ff2d5f);
  }
  
  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .leaderboard-table th {
    background-color: rgba(40, 40, 70, 0.7);
    padding: 1rem;
    text-align: left;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .leaderboard-table td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }
  
  .leaderboard-table tr:last-child td {
    border-bottom: none;
  }
  
  .leaderboard-table tr:hover td {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }
  
  .user-link {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .user-link:hover {
    color: #ff8a8a;
  }
  
  .blur-circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    animation: float 15s ease-in-out infinite;
  }
  
  .blur-circle.pink {
    background: radial-gradient(circle, rgba(255, 94, 125, 0.2), transparent 70%);
    top: 20%;
    left: 10%;
  }
  
  .blur-circle.blue {
    background: radial-gradient(circle, rgba(100, 108, 255, 0.2), transparent 70%);
    bottom: 10%;
    right: 10%;
    animation-delay: 2s;
    animation-direction: reverse;
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
    
    .header-panel {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding-top: 1rem;
    }
    
    .home-button {
      position: relative;
      left: auto;
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      text-align: center;
    }
    
    .leaderboard-container {
      padding: 1rem;
    }
    
    .leaderboard-table th,
    .leaderboard-table td {
      padding: 0.75rem;
    }
  }
  </style>