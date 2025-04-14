import { ref } from 'vue';
import { app } from '@/Firebase/config';

const getQuizzes = () => {
    const quizzes = ref([])
    const error = ref(null)

    const load = async() => {
        try {
            const res = await app.collection('quizzes').get();
            quizzes.value = res.docs.map(doc => {
                return {...doc.data(), id: doc.id }
            })
        } catch (err) {
            error.value = err.message
        }
    }
    return { quizzes, error, load }
};

export default getQuizzes;