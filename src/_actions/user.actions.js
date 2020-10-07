import { userConstants } from '../_constants';
//import { userService } from '../_services';
import myFirebase from '../_services/firebase';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    verifyAuth,
    register,
    //getAll,
    //delete: _delete,
    forgot
};

const db = myFirebase.firestore();

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        //userService.login(username, password)
        myFirebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(
                fireBaseUser => { 
                    var user = myFirebase.auth().currentUser;
                    dispatch(success(
                        {
                            email:      user.email,
                            id:         user.uid,
                            username:   user.email,
                            firstName:  user.displayName,
                            lastName:   user.lastName,
                            token:      user.refreshToken
                        } 
                    ));
                    db.collection("users").doc(email).update({Online: true});
                    history.push('/');
                    //console.log(fireBaseUser);
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            )
    };
    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    return dispatch => {
        dispatch(request());
        const user = myFirebase.auth().currentUser;
        myFirebase
            .auth()
            .signOut()
            .then(() => {
                dispatch(success());
                db.collection("users").doc(user.email).update({Online: false});
            })
            .catch(error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            });
    };
    function request() { return { type: userConstants.LOGOUT_REQUEST } }
    function success() { return { type: userConstants.LOGOUT_SUCCESS } }
    function failure(error) { return { type: userConstants.LOGOUT_FAILURE, error } }
}

function verifyAuth() {
    return dispatch => {
        dispatch(verifyrequest());
        myFirebase
            .auth()
            .onAuthStateChanged(
                user => {
                    if (user !== null) {
                        dispatch(loginsuccess(user));
                        history.push('/');
                    }
                    dispatch(verifysuccess());
                });
    };
    function verifyrequest() { return { type: userConstants.VERIFY_REQUEST } }
    function verifysuccess() { return { type: userConstants.VERIFY_SUCCESS } }
    function loginsuccess(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
}

function register(user) {
    const userData = user;
    return dispatch => {
        dispatch(request( { user } ));
        myFirebase
            .auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(dataBeforeEmail => {
                myFirebase.auth().onAuthStateChanged(function(user) {
                    user.sendEmailVerification();
                });
            })
            .then(dataAfterEmail => {
                myFirebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        dispatch(success(user));
                        //console.log(userData);
                        db.collection("users").doc(user.email).set({
                            Name: userData.firstName,
                            Surname: userData.lastName,
                            Online: false
                        });
                        history.push('/login');
                        dispatch(alertActions.success('Registration successful'));
                    } else {
                        dispatch(failure());
                    }
                })
            })
            .catch(function (error) {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            })
        };
    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getUserData(user) {
    return dispath => {
        dispatch(request(user));
        const snapshot = db.collection("users").get();
        snapshot.forEach(doc => {
            console.log(doc.id, "=>", doc.firstName);
        });
    };
    function request(user) { return { type: userConstants.GETALL_REQUEST, user } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

/*
function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
        myFirebase
            .auth()
            .
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}


// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}
*/

function forgot(email) {
    return dispatch => {
        dispatch(request({ email }));

        myFirebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.RESETPASS_REQUEST, user } }
    function success(user) { return { type: userConstants.RESETPASS_SUCCESS, user } }
    function failure(error) { return { type: userConstants.RESETPASS_FAILURE, error } }
};