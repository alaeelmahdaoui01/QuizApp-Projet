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
  
        <!-- Leaderboard Section -->
        <div class="leaderboard">
          <div class="leaderboard-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
          </div>
          <div class="leaderboard-item" v-for="(user, index) in allUsers" :key="user.uid">
            <span class="rank">{{ index + 1 }}</span>
            <span class="player">
              <router-link :to="`/profile/${user.uid}`" class="user-link">
                {{ user.displayName }}
              </router-link>
            </span>
            <span class="score">{{ user.totalScore }}</span>
          </div>
        </div>
      </main>
      <div class="blur-circle pink"></div>
      <div class="blur-circle blue"></div>
    </div>
  </template>
  
  
  <script>

  //import { getUser } from "@/Firebase/Authentification/getUser.js";
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
  
  /* Leaderboard container */
.leaderboard-container {
    max-width: 800px;
    margin: 2rem auto 50px auto;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1;
}

/* Section title */
.section-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #fff;
    font-size: 1.5rem;
}

/* Header panel (return button + title) */
.header-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
}

.home-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.home-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Leaderboard header row */
.leaderboard-header {
    display: grid;
    grid-template-columns: 60px 1fr 80px;
    padding: 0.5rem 1rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 0.5rem;
}

/* Leaderboard list wrapper */
.leaderboard {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* Each leaderboard row */
.leaderboard-item {
    display: grid;
    grid-template-columns: 60px 1fr 80px;
    align-items: center;
    padding: 0.8rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.leaderboard-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Rank style */
.rank {
    font-weight: bold;
    color: #ff5e7d;
}

/* Player name & link */
.player {
    display: flex;
    align-items: center;
    gap: 10px;
}

.player a {
    color: #fff;
    text-decoration: none;
    transition: color 0.2s ease;
}

.player a:hover {
    color: #ff5e7d;
    text-decoration: underline;
}

/* Score styling */
.score {
    text-align: right;
    color: #4caf50;
}

/* Medal colors for top 3 */
.leaderboard-item:nth-child(1) .rank {
    color: gold;
}

.leaderboard-item:nth-child(2) .rank {
    color: silver;
}

.leaderboard-item:nth-child(3) .rank {
    color: #cd7f32;
}

/* Blur background circles */
.blur-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.6;
    z-index: 0;
}

.blur-circle.pink {
    width: 200px;
    height: 200px;
    background-color: #ff5e7d;
    top: -50px;
    right: -50px;
}

.blur-circle.blue {
    width: 200px;
    height: 200px;
    background-color: #5ecbff;
    bottom: -50px;
    left: -50px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .leaderboard-container {
        padding: 1rem;
    }

    .leaderboard-header,
    .leaderboard-item {
        grid-template-columns: 40px 1fr 60px;
        padding: 0.5rem;
        font-size: 0.9rem;
    }

    .section-title {
        font-size: 1.3rem;
        margin-bottom: 1rem;
    }
}

  </style>