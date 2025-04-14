import { db } from '../config'; // import db

export const getQuizzes = async() => {
    try {
        const quizCollection = db.collection('quizzes'); // Access Firestore collection
        const quizSnapshot = await quizCollection.get();
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