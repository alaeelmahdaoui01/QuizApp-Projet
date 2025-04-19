import { ref } from 'vue';
import { auth } from "@/Firebase/config";
import { app } from "@/Firebase/config";

const user = ref(auth.currentUser);
let authInitialized = false;
let authResolve;


const authReady = new Promise(resolve => {
    authResolve = resolve;
});

const observeUserState = (callBack) => {
    return auth.onAuthStateChanged(callBack);
}

auth.onAuthStateChanged(_user => {
    user.value = _user;
    authInitialized = true;
    authResolve();
});

const getUser = () => {
    return user.value;
}

const isLogged = () => {
    return !!user.value;
}

const waitForAuthInit = () => {
    if (authInitialized) {
        return Promise.resolve();
    }
    return authReady;
}

const getUserById = async(uid) => {
    const res = await app.collection('users').doc(uid).get();
    return res.data();
};
// ✅ Add this
// const updateUserProfile = async(userId, { displayName, email }) => {
//     const currentUser = auth.currentUser;
//     if (!currentUser || currentUser.uid !== userId) {
//         alert("Unauthorized or invalid user.");
//         throw new Error("Unauthorized or invalid user.");
//     }

//     if (displayName && currentUser.displayName !== displayName) {
//         await updateProfile(currentUser, { displayName });
//     }

//     if (email && currentUser.email !== email) {
//         await updateEmail(currentUser, email);
//     }

//     // Optionally update Firestore too:
//     await app.collection('users').doc(userId).update({
//         displayName,
//         email
//     });
// };

const updateUserProfile = async(userId, { displayName, email }) => {
    const currentUser = auth.currentUser;
    console.log("Current User:", currentUser);
    console.log("User ID:", userId);
    console.log("Updating DisplayName:", displayName);
    console.log("Updating Email:", email);

    if (!currentUser || currentUser.uid !== userId) {
        alert("Unauthorized or invalid user.");
        throw new Error("Unauthorized or invalid user.");
    }

    if (displayName && currentUser.displayName !== displayName) {
        console.log("Updating Firebase displayName...");
        await currentUser.updateProfile({ displayName });
    }

    if (email && currentUser.email !== email) {
        console.log("Updating Firebase email...");

        // Send email verification before updating the email
        await currentUser.updateEmail(email);

        // After email update, send verification email
        await currentUser.sendEmailVerification();
        alert("Verification email sent. Please verify your new email.");
    }

    const userDocRef = app.collection('users').doc(userId); // Ensure `app` is your Firestore instance
    await userDocRef.update({
        ...(displayName && { displayName }),
        ...(email && { email }),
    });

    // const db = getFirestore();
    // const userDocRef = doc(db, "users", userId);
    // await updateDoc(userDocRef, {
    //     ...(displayName && { displayName }),
    //     ...(email && { email }),
    // });

};

const getCurrentUserId = () => {
    const user = auth.currentUser;

    if (user) {
        return user.uid;

    } else {
        console.warn("No user is currently logged in.");
        return null;
    }
}

export { getUser, isLogged, waitForAuthInit, observeUserState, getUserById, updateUserProfile, getCurrentUserId };