import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeUser from '../views/HomeUser.vue'
import LoginView from '../views/LoginView.vue'
import CreateQuiz from '@/components/CreateQuiz.vue'
import HomeAdmin from '@/views/HomeAdmin.vue'
import EditView from '@/components/editView.vue';
import AvailableQuizzes from '../views/QuizzesView.vue';
import CurrentQuizInfo from '../views/QuizView.vue';
import QuizViewAdmin from '../views/QuizViewAdmin.vue';
import QuizQsts from '@/views/QuizQsts.vue';
import Leaderboard from '@/views/LeaderBoard.vue';
import ProfileView from '@/views/ProfileView.vue';
import ProfileAdmin from '@/views/ProfileAdmin.vue';

const routes = [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },

    {
        path: '/create',
        name: 'create',
        component: CreateQuiz
    },
    {
        path: '/homeadmin',
        name: 'homeadmin',
        component: HomeAdmin
    },
    {
        path: '/homeuser',
        name: 'homeuser',
        component: HomeUser
    },
    {
        path: '/admin/edit/:id',
        name: 'EditQuiz',
        component: EditView,
        props: true,
    },
    {
        path: '/quizzes',
        name: 'Available quizzes',
        component: AvailableQuizzes
    },

    {
        path: '/quiz/:id',
        name: 'Quiz info',
        component: CurrentQuizInfo,
        props: true,
    },
    {
        path: '/quizadmin/:id',
        name: 'Quiz info Admin',
        component: QuizViewAdmin,
        props: true,
    },
    {
        path: '/quizpass/:id',
        name: 'QuizQsts',
        component: QuizQsts,
        props: true,
    },
    {
        path: '/leaderboard',
        name: 'Leaderboard',
        component: Leaderboard
    },
    {
        path: '/profile/:id',
        name: 'Profile',
        component: ProfileView,
        props: true,
    },
    {
        path: '/profileadmin/:id',
        name: 'Profile Admin',
        component: ProfileAdmin,
        props: true,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router