import { userConstants } from '../_constants';
import myFirebase from '../_services/firebase';

//let user = JSON.parse(localStorage.getItem('user'));
//const initialState = user ? { loggedIn: true, user } : {};

//var user = myFirebase.auth().currentUser;
const initialState = { 
  loggingIn: false,
  loggedIn: true,
  loginError: false,
  resettingPass: false,
  resetPass: false,
  verifying: false,
  verified: false,
  user: {}
};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        loginError: false,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        loginError: true
      };
    case userConstants.LOGOUT_REQUEST:
      return {};
    case userConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false
      };
    case userConstants.LOGOUT_FAILURE:
      return {};
    case userConstants.VERIFY_REQUEST:
      return {
        ...state,
        verifying: true
      };
    case userConstants.VERIFY_SUCCESS:
      return {
        ...state,
        verifying: false,
        verified: true
      };
    case userConstants.RESETPASS_REQUEST:
      return { 
        ...state,
        resettingPass: true,
        user: action.user
      };
    case userConstants.RESETPASS_SUCCESS:
      return {
        ...state,
        resetPass: true,
        user: action.user
      };
    case userConstants.RESETPASS_FAILURE:
      return { 
        ...state,
        resettingPass: false,
      };
    default:
      return state
  }
} 