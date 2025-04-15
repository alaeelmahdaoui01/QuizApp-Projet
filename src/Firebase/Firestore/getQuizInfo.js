import firebase from "firebase/app";
import "firebase/firestore";
import { app } from '../config.js'
import { ref } from 'vue'

const getquiz = (id) => {

    const quiz = ref({});
    const error = ref(null);

    const load = async() => {
        try {
            let res = await app.collection('quizzes').doc(id).get()
            if (!res.exists) {
                throw Error('This quiz does not exist')
            }
            quiz.value = {...res.data(), id: res.id }
        } catch (err) {
            error.value = err.message
        }
    }

    return { quiz, error, load }
}

const getQuizzesByIds = (ids) => {
    const posts = ref([]);
    const error = ref(null);

    const load = async() => {
        try {
            const querySnapshot = await app.collection('quizzes')
                .where(firebase.firestore.FieldPath.documentId(), 'in', ids)
                .get();

            const documents = [];
            querySnapshot.forEach((doc) => {
                documents.push({ id: doc.id, ...doc.data() });
            });
            quizzes.value = documents;
        } catch (err) {
            error.value = err.message
        }
    }

    return { quizzes, error, load }
}

export { getquiz, getQuizzesByIds }