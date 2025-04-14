// src/Firebase/Firestore/edit.js
import { db } from '../config';

/**
 * Updates quiz information including adding/removing questions.
 * @param {string} quizId - The ID of the quiz to update.
 * @param {object} updatedData - The data to update in the quiz.
 * Example:
 * {
 *   title: 'New Title',
 *   category: 'Math',
 *   difficulty: 'easy',
 *   questions: [{ question: '...', options: [...], answer: '...' }, ...]
 * }
 */
export const editQuiz = async (quizId, updatedData) => {
  try {
    await db.collection('quizzes').doc(quizId).update(updatedData);
    console.log(`Quiz with ID ${quizId} successfully updated.`);
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};
