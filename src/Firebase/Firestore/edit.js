// src/Firebase/Firestore/edit.js
import { db } from '../config';


export const editQuiz = async (quizId, updatedData) => {
    if (!quizId || !updatedData || Object.keys(updatedData).length === 0) {
      throw new Error("Invalid quiz ID or data to update.");
    }
  
    try {
      await db.collection('quizzes').doc(quizId).update(updatedData);
      console.log(`Quiz with ID ${quizId} successfully updated.`);
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  };
  
