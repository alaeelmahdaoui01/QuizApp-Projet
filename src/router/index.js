import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CreateQuiz from '../components/CreateQuiz.vue'
import HomeAdmin from '../views/HomeAdmin.vue'
import HomeUser from '../views/HomeUser.vue'

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
        path: '/homeuser',
        name: 'home user',
        component: HomeUser
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
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router