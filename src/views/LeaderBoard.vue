<template>
    <div class="leaderboard-container">
      <h2>🏆 Quiz Leaderboard</h2>
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in allUsers" :key="user.uid">
            <td>{{ index + 1 }}</td>
            <td>{{ user.displayName }}</td>
            <td>{{ user.totalScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  
  export default {
    name: 'LeaderboardView',
    data() {
      return {
        allUsers: []
      };
    },
    async mounted() {
      const usersRef = firebase.firestore().collection("users");
      const snapshot = await usersRef.get();
  
      const usersWithScores = snapshot.docs.map(doc => {
        const data = doc.data();
        const totalScore = (data.quizzes || []).reduce((sum, q) => sum + (q.score || 0), 0);
        return {
          uid: doc.id,
          displayName: data.displayName || "Anonymous",
          totalScore
        };
      });
  
      // Sort all users by total score
      this.allUsers = usersWithScores.sort((a, b) => b.totalScore - a.totalScore);
    }
  };
  </script>
  
  <style scoped>
  .leaderboard-container {
    padding: 2rem;
    max-width: 700px;
    margin: auto;
    background: #1c1c2e;
    border-radius: 12px;
    color: #fff;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
  h2 {
    text-align: center;
    margin-bottom: 1rem;
  }
  .leaderboard-table {
    width: 100%;
    border-collapse: collapse;
  }
  .leaderboard-table th,
  .leaderboard-table td {
    padding: 12px;
    border-bottom: 1px solid #444;
    text-align: center;
  }
  .leaderboard-table th {
    background-color: #282846;
  }
  </style>
  