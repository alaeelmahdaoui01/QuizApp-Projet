<template>
    <!-- @submit.prevent="generateApiUrl" -->
     fifooooooooooooooooo
    <!-- <div>
        dodo
      <form class="form-api" >
        <h2>API Helper</h2>
  
        <label for="trivia_amount">Number of Questions:</label>
        <input 
          type="number" 
          id="trivia_amount" 
          v-model="formData.amount" 
          min="1" 
          max="50" 
          class="form-control" 
        />
  
        <label for="trivia_category">Select Category:</label>
        <select id="trivia_category" v-model="formData.category" class="form-control">
          <option value="any">Any Category</option>
          <option value="9">General Knowledge</option>
          <option value="10">Entertainment: Books</option>
          <option value="11">Entertainment: Film</option>
          <option value="12">Entertainment: Music</option>
          <option value="13">Entertainment: Musicals &amp; Theatres</option>
          <option value="14">Entertainment: Television</option>
          <option value="15">Entertainment: Video Games</option>
          <option value="16">Entertainment: Board Games</option>
          <option value="17">Science &amp; Nature</option>
          <option value="18">Science: Computers</option>
          <option value="19">Science: Mathematics</option>
          <option value="20">Mythology</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
          <option value="23">History</option>
          <option value="24">Politics</option>
          <option value="25">Art</option>
          <option value="26">Celebrities</option>
          <option value="27">Animals</option>
          <option value="28">Vehicles</option>
          <option value="29">Entertainment: Comics</option>
          <option value="30">Science: Gadgets</option>
          <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
          <option value="32">Entertainment: Cartoon &amp; Animations</option>
        </select>
  
        <label for="trivia_difficulty">Select Difficulty:</label>
        <select id="trivia_difficulty" v-model="formData.difficulty" class="form-control">
          <option value="any">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
  
        <label for="trivia_type">Select Type:</label>
        <select id="trivia_type" v-model="formData.type" class="form-control">
          <option value="any">Any Type</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
  
        <label for="trivia_encode">Select Encoding:</label>
        <select id="trivia_encode" v-model="formData.encode" class="form-control">
          <option value="default">Default Encoding</option>
          <option value="urlLegacy">Legacy URL Encoding</option>
          <option value="url3986">URL Encoding (RFC 3986)</option>
          <option value="base64">Base64 Encoding</option>
        </select>
  
        <br />
        <button type="submit">Generate API URL</button>
      </form>
    </div> -->
  </template>
  
  <script>
  export default {
    name: "QuizPage",
    data() {
      return {
        formData: {
          amount: 10,
          category: "any",
          difficulty: "any",
          type: "any",
          encode: "default",
        },
        apiUrl: "",
      };
    },
    methods: {
      generateApiUrl() {
        const { amount, category, difficulty, type, encode } = this.formData;
  
        // Validate the amount of questions
        if (amount < 1 || amount > 50) {
          alert("Please enter a number between 1 and 50 for the number of questions.");
          return;
        }
  
        const params = [
          `amount=${amount}`,
          category !== "any" ? `category=${category}` : "",
          difficulty !== "any" ? `difficulty=${difficulty}` : "",
          type !== "any" ? `type=${type}` : "",
          encode !== "default" ? `encode=${encode}` : "",
        ]
          .filter(Boolean)
          .join("&");
  
        this.apiUrl = `https://opentdb.com/api.php?${params}`;
        console.log("Generated API URL:", this.apiUrl);
      },
    },
  };
  </script>
  
  <style scoped>
  .form-api {
    margin: 20px;
  }
  
  label {
    display: block;
    margin: 10px 0 5px;
  }
  
  input,
  select {
    margin-bottom: 10px;
    width: 100%;
    padding: 5px;
    font-size: 16px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  