<!-- <template>
  <div class="quizzes-container">
    <div class="quiz-column" v-for="(column, index) in columns" :key="index">
      <div v-for="quiz in column" :key="quiz.id" class="quiz-item">
        <h1 class="quiz-title">{{ quiz.title }}</h1>
        <p class="quiz-author">By {{ quiz.authorName }}</p>
        <router-link :to="'/quiz/' + quiz.id" class="view-link">
          <button class="view-button">Start Quiz</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserById } from "@/Firebase/Authentification/getUser";

export default {
  props: ["quizzes"],
  data() {
    return {
      quizzesWithUsernames: [],
    };
  },
  async created() {
    this.quizzesWithUsernames = await this.getQuizzesWithUsernames(this.quizzes);
  },
  computed: {
    columns() {
      const quizzesCopy = [...this.quizzesWithUsernames];
      const columns = [[], [], []];
      quizzesCopy.forEach((quiz, index) => {
        columns[index % 3].push(quiz);
      });
      return columns;
    },
  },
  methods: {
    async getUserName(userId) {
      try {
        const user = await getUserById(userId);
        return user?.displayName || "Unknown";
      } catch (error) {
        console.error("Error fetching user name:", error);
        return "Unknown";
      }
    },
    async getQuizzesWithUsernames(quizzes) {
      try {
        return await Promise.all(
          quizzes.map(async (quiz) => {
            const authorName = await this.getUserName(quiz.author);
            return { ...quiz, authorName };
          })
        );
      } catch (error) {
        console.error("Error processing quizzes:", error);
        return quizzes.map((quiz) => ({ ...quiz, authorName: "Unknown" }));
      }
    },
  },
};
</script>

<style scoped>
.quizzes-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.quiz-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.quiz-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.quiz-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quiz-author {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.view-link {
  display: inline-block;
  width: 100%;
}

.view-button {
  background: linear-gradient(135deg, #22192b 0%, #2c121a 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s ease;
}

.view-button:hover {
  background: linear-gradient(135deg, #2c121a 0%, #6d2436 100%);
  box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
}
</style> -->

<template>
  <div class="quizzes-container">
    <div class="quiz-column" v-for="(column, index) in columns" :key="index">
      <div v-for="quiz in column" :key="quiz.quizId" class="quiz-item">
        <h1 class="quiz-title">{{ quiz.quizId }}</h1>
        <p class="quiz-score">Score: {{ quiz.score }}</p>
        <p class="quiz-time">Time Spent: {{ formatTime(quiz.timeSpent) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quizzes"],
  computed: {
    columns() {
      const quizzesCopy = [...this.quizzes];
      const columns = [[], [], []];
      quizzesCopy.forEach((quiz, index) => {
        columns[index % 3].push(quiz);
      });
      return columns;
    },
  },
  methods: {
    formatTime(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000) % 60;
      const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
      const hours = Math.floor(milliseconds / 1000 / 60 / 60);
      return `${hours}h ${minutes}m ${seconds}s`;
    },
  },
};
</script>

<!-- <style scoped>
.quizzes-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.quiz-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.quiz-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.quiz-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quiz-score,
.quiz-time {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

</style>
 -->

 <style scoped>
.quizzes-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 0 1rem;
}

.quiz-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: white;
}

.quiz-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 25px rgba(255, 45, 95, 0.2);
  border-color: rgba(255, 94, 125, 0.3);
}

.quiz-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
  position: relative;
  padding-left: 1rem;
}
.quiz-score,
.quiz-time {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.quiz-time {
  margin-top: 0.5rem;
}

@media (max-width: 992px) {
  .quizzes-container {
    flex-wrap: wrap;
  }

  .quiz-column {
    flex: 1 1 calc(33.33% - 20px);
  }
}

@media (max-width: 768px) {
  .quiz-column {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 576px) {
  .quiz-column {
    flex: 1 1 100%;
  }
}
</style>
