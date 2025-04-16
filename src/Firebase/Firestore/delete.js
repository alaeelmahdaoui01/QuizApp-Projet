// src/Firebase/Firestore/delete.js
import { app } from '../config';


export const deleteQuiz = async(quizId) => {
    try {
        await app.collection('quizzes').doc(quizId).delete();
        console.log(`Quiz with ID ${quizId} successfully deleted.`);
    } catch (error) {
        console.error('Error deleting quiz:', error);
        throw error;
    }
};