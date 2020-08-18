import myFirebase from '../_services/firebase';

export function authHeader() {
    // return authorization header with jwt token
    //let user = JSON.parse(localStorage.getItem('user'));
    let user = myFirebase.auth().currentUser;

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}