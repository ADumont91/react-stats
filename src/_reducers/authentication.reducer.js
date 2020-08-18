import { userConstants } from '../_constants';
import myFirebase from '../_services/firebase';

//let user = JSON.parse(localStorage.getItem('user'));
//const initialState = user ? { loggedIn: true, user } : {};

var user = myFirebase.auth().currentUser;
const initialState = { user : {} };

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT_REQUEST:
      return {};
    case userConstants.LOGOUT_SUCCESS:
      return {};
    case userConstants.LOGOUT_FAILURE:
      return {};
    case userConstants.RESETPASS_REQUEST:
      return { 
        resettingPass: true,
        user: action.user
      };
    case userConstants.RESETPASS_SUCCESS:
      return {
        resettingPass: true,
        user: action.user
      };
    case userConstants.RESETPASS_FAILURE:
      return { 
        resettingPass: false,
      };
    default:
      return state
  }
} 