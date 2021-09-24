import {NavigationStateAction} from './Types';

export const RESTORE_TOKEN = 'RESTORE_TOKEN';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

export const restoreToken = (token: string): NavigationStateAction => {
  return {type: RESTORE_TOKEN, token: token};
};

export const sigIn = (token: string): NavigationStateAction => {
  return {type: SIGN_IN, token: token};
};

export const signOut = (): NavigationStateAction => {
  return {type: SIGN_OUT};
};
