

<template>
    <div class="quiz">
        <div class="home-signedin-container">
            <button class="home-button" @click="goToHome">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Return to Home page
            </button>
            
            <Quiz :quiz="mainQuiz" />
            
            
            <!-- Leaderboard Section -->
            <div class="leaderboard">
                <h2>Leaderboard</h2>
                <div class="leaderboard-list">
                    <div class="leaderboard-header">
                        <span>Rank</span>
                        <span>Player</span>
                        <span>Score</span>
                    </div>
                    <div class="leaderboard-item" v-for="(player, index) in leaderboard" :key="player.id">
                        <span class="rank">{{ index + 1 }}</span>
                        <span class="player">
                            
                            <router-link :to="`/profile/${player.userId}`">{{ player.email }}</router-link>
                        </span>
                        
                        <span class="score">{{ player.score }}/{{ maxScore }}</span>
                    </div>

                </div>
            </div>
            
            <div class="blur-circle pink"></div>
            <div class="blur-circle blue"></div>
        </div>
    </div>
</template>

<script>
import { getUserById } from '@/Firebase/Authentification/getUser';
import Quiz from '@/components/QuizComp.vue';
import { getUser } from '@/Firebase/Authentification/getUser';
import { getquiz } from '@/Firebase/Firestore/getQuizInfo.js';

export default {
    name: 'DiscussionView',
    components: {
        Quiz,
    },
    data() {
        return {
            mainQuiz: null,
            currentUserId: getUser()?.uid || null,
            user: {},
            leaderboard: [],
            maxScore: 10
        };
    },
    async created() {
        await this.loadQuiz();
        const user = getUser();
        this.user = user;
        console.log(user);
    },
    methods: {
        async loadQuiz() {
            console.log("Loading quiz with ID:", this.$route.params.id);
            const { quiz, error, load } = getquiz(this.$route.params.id);
            await load();
            console.log("Quiz data:", quiz.value);
            console.log("Error:", error.value);
            this.mainQuiz = quiz.value;

            // Set max score based on quiz questions count
            if (quiz.value && quiz.value.questions) {
                this.maxScore = quiz.value.questions.length;
            }

            // Load leaderboard from participants + enrich with user info
            if (quiz.value && quiz.value.participants) {
                const enrichedParticipants = await Promise.all(
                    quiz.value.participants.map(async (p) => {
                        const userData = await getUserById(p.userId);
                        return {
                            ...p,
                            ...userData
                        };
                    })
                );

                this.leaderboard = enrichedParticipants.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return a.time - b.time;
                });
            }
        },
        goToHome() {
            this.$router.push('/homeuser');
        }
    }
};
</script>

<style scoped>
.quiz {
    position: relative;
    min-height: 100vh;
    padding-top: 80px;
    background-color: #1e1e2f;
    color: white;
}

.home-signedin-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
}

.home-button {
    position: absolute;
    top: 20px;
    left: 40px; /* Changed from right to left */
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    z-index: 10;
}

.home-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.reply-form {
    max-width: 800px;
    margin: 2rem auto;
    text-align: center;
    position: relative;
    z-index: 1;
}

.reply-button {
    background: linear-gradient(135deg, #ff5e7d 0%, #ff2d5f 100%);
    color: white;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 50px;
    border: none;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(255, 45, 95, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
}

.reply-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 45, 95, 0.4);
}

.blur-circle {
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.6;
}

.blur-circle.pink {
    background: radial-gradient(circle, rgba(255, 110, 199, 0.3), transparent 70%);
    top: 20%;
    left: 10%;
    animation: float 15s ease-in-out infinite;
}

.blur-circle.blue {
    background: radial-gradient(circle, rgba(100, 108, 255, 0.3), transparent 70%);
    bottom: 10%;
    right: 10%;
    animation: float 18s ease-in-out infinite reverse;
}

@keyframes float {
    0%, 100% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(30px, 30px);
    }
}

@media (max-width: 768px) {
    .quiz {
        padding-top: 70px;
    }
    
    .home-signedin-container {
        padding: 0 1.5rem;
    }
    
    .home-button {
        left: 20px; /* Changed from right to left */
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
    }
    
    .blur-circle {
        width: 300px;
        height: 300px;
        filter: blur(60px);
    }
}
.leaderboard {
    max-width: 800px;
    margin: 2rem auto;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1;
    margin-bottom : 50px;
}

.leaderboard h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #fff;
    font-size: 1.5rem;
}

.leaderboard-header {
    display: grid;
    grid-template-columns: 60px 1fr 80px 80px;
    padding: 0.5rem 1rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 0.5rem;
}


.leaderboard-item {
    display: grid;
    grid-template-columns: 60px 1fr 80px 80px;
    align-items: center;
    padding: 0.8rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-bottom: 0.5rem;
    transition: all 0.3s ease;
}

.leaderboard-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.rank {
    font-weight: bold;
    color: #ff5e7d;
}

.player {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
}

.score {
    text-align: right;
    color: #4caf50;
}

.time {
    text-align: right;
    color: #2196f3;
}

/* Medal colors for top 3 */
.leaderboard-item:nth-child(1) .rank {
    color: gold;
}
.leaderboard-item:nth-child(2) .rank {
    color: silver;
}
.leaderboard-item:nth-child(3) .rank {
    color: #cd7f32; /* bronze */
}

@media (max-width: 768px) {
    .leaderboard {
        padding: 1rem;
    }
    
    .leaderboard-header,
    .leaderboard-item {
        grid-template-columns: 40px 1fr 60px 60px;
        padding: 0.5rem;
        font-size: 0.9rem;
    }
    
    .avatar {
        width: 25px;
        height: 25px;
    }
}
</style>