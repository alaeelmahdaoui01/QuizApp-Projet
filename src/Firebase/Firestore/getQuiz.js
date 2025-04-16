import { app } from '../config'; // import db
// In getQuiz.js
export const getQuizzes = async(userId) => {
    try {
        const quizCollection = app.collection('quizzes');
        const quizSnapshot = await quizCollection.where('createdBy', '==', userId).get();
        const quizzesList = quizSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return quizzesList;
    } catch (error) {
        console.error('Error fetching quizzes: ', error);
        return [];
    }
};