import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
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
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router