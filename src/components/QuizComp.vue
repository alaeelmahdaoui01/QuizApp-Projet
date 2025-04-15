<template>
    <div class="thread-container" v-if="quiz">
      <div v-if="authorName" class="thread-header">
        <h2>{{ quiz.title }}</h2>
        <p class="thread-info">Posted by <router-link :to="'/profile/' + quiz.createdBy"> {{ authorName }} </router-link></p>
      </div>
      <div class="thread-content">
        
      </div>
    </div>
  </template>
  
  <script>
  import { getUserById } from '@/Firebase/Authentification/getUser';
  export default {
    name: 'SingleThread',
    data() {
      return {
        authorName: ''
      };
    },
    async created() {
      if (this.quiz && this.quiz.createdBy) {
        try {
          const name = await this.getuser(this.quiz.createdBy);
          this.authorName = name;
        } catch (error) {
          console.error('Error fetching author name:', error);
        }
      }
    },
    methods: {
      async getuser(id) {
        const user = await getUserById(id);
        return user.displayName;
      }
    },
    props: {
      quiz: {
        type: Object,
        required: true
      }
    }
  };
  </script>

  
<style scoped>
.thread-container {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
}

.thread-header {
  margin-bottom: 10px;
}
.thread-header h2 {
    margin: 0;
  }
  
  .thread-info {
    font-size: 14px;
    color: #888;
  }
  
  .thread-content {
    margin-bottom: 15px;
  }
  </style>