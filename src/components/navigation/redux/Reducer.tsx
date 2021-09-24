import {NavigationState, NavigationStateAction} from './Types';

export const reducer = (
  prevState: NavigationState,
  action: NavigationStateAction,
): NavigationState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userEmail: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userEmail: action.token,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userEmail: undefined,
      };
    default:
      return {
        isLoading: true,
        isSignout: false,
        userEmail: undefined,
      };
  }
};
