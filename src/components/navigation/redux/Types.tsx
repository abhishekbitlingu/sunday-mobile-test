export type NavigationStateAction = {
  type: string;
  token?: string;
};

export type NavigationState = {
  isLoading: boolean;
  isSignout: boolean;
  userEmail?: string;
};
export type Reducer<NavigationState, NavigationStateAction> = (
  prevState: NavigationState,
  action: NavigationStateAction,
) => NavigationState;

export type NavigationAuthContext = {
  signIn: (userEmail: string) => void;
  signOut: () => void;
  signUp: (userEmail: string) => void;
};
