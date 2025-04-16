import { ref } from 'vue';
import { auth } from "@/Firebase/config";

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

export { getUser, isLogged, waitForAuthInit, observeUserState };