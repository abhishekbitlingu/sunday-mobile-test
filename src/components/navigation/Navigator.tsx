import {Login} from '@/routes/Login';
import {
  CountryStackParamList,
  HomeDrawerParamList,
  RootStackParamList,
  UserStackParamList,
} from '@/types/Types';
import {createStackNavigator} from '@react-navigation/stack';
import React, {createContext} from 'react';
import {CreateAccount} from '@/routes/CreateAccount';
import {CountryList} from '@/routes/CountryList';
import {reducer} from './redux/Reducer';
import {restoreToken, sigIn, signOut} from './redux/Actions';
import {NavigationAuthContext} from './redux/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {asyncStorageKeys} from '@/utils/constants.json';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {colors, screenTitles, drawerLabels} from '@/utils/constants.json';
import {UserList} from '@/routes/UserList';
import HamburgerIcon from 'react-native-vector-icons/Feather';
import PowerIcon from 'react-native-vector-icons/Feather';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {PlayerList} from '@/routes/PlayerList';
import ArrowIcon from 'react-native-vector-icons/AntDesign';

const styles = StyleSheet.create({
  drawerNavLeftButton: {marginHorizontal: 20},
});

const Stack = createStackNavigator<RootStackParamList>();
const UserStack = createStackNavigator<UserStackParamList>();
const CountryStack = createStackNavigator<CountryStackParamList>();

const Drawer = createDrawerNavigator<HomeDrawerParamList>();
export const AuthContext = createContext<NavigationAuthContext>({
  signIn: (userEmail: string) => {
    console.log(userEmail);
  },
  signOut: () => {},
  signUp: (userEmail: string) => {
    console.log(userEmail);
  },
});

const AuthenticationStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Login'}>
      <Stack.Screen
        name={'Login'}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'CreateAccount'}
        component={CreateAccount}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const UserListStack = (): JSX.Element => {
  return (
    <UserStack.Navigator
      initialRouteName={'UserList'}
      screenOptions={props => {
        const {navigation} = props;
        return {
          headerTitleStyle: {color: colors.uiGray},
          headerLeft: () => (
            <TouchableOpacity
              style={styles.drawerNavLeftButton}
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <HamburgerIcon name={'menu'} size={20} color={colors.uiGray} />
            </TouchableOpacity>
          ),
        };
      }}>
      <UserStack.Screen
        name={'UserList'}
        component={UserList}
        options={{
          headerTitle: screenTitles.userList,
        }}
      />
    </UserStack.Navigator>
  );
};

const CountryListStack = (): JSX.Element => {
  const logOut = React.useContext(AuthContext).signOut;
  return (
    <CountryStack.Navigator
      initialRouteName={'CountryList'}
      screenOptions={props => {
        const {navigation} = props;
        return {
          headerTitleStyle: {color: colors.uiGray},
          headerLeft: () => (
            <TouchableOpacity
              style={styles.drawerNavLeftButton}
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <HamburgerIcon name={'menu'} size={20} color={colors.uiGray} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.drawerNavLeftButton}
              onPress={() => {
                try {
                  AsyncStorage.clear(() => {
                    logOut();
                  });
                } catch {}
              }}>
              <PowerIcon name={'power'} size={20} color={colors.uiGray} />
            </TouchableOpacity>
          ),
        };
      }}>
      <CountryStack.Screen
        name={'CountryList'}
        component={CountryList}
        options={{headerTitle: screenTitles.countryList}}
      />
      <CountryStack.Screen
        name={'PlayerList'}
        component={PlayerList}
        options={props => {
          const {navigation} = props;
          return {
            headerLeft: () => (
              <TouchableOpacity
                style={styles.drawerNavLeftButton}
                onPress={() => {
                  navigation.goBack();
                }}>
                <ArrowIcon name={'arrowleft'} size={25} color={colors.uiGray} />
              </TouchableOpacity>
            ),
          };
        }}
      />
    </CountryStack.Navigator>
  );
};

const HomeDrawer = (): JSX.Element => {
  return (
    <Drawer.Navigator
      screenOptions={() => {
        return {
          drawerActiveTintColor: colors.uiYellow,
          headerShown: false,
        };
      }}>
      <Drawer.Screen
        name="CountryListStack"
        options={{drawerLabel: drawerLabels.countryList}}
        component={CountryListStack}
      />
      <Drawer.Screen
        name="UserListStack"
        options={{drawerLabel: drawerLabels.userList}}
        component={UserListStack}
      />
    </Drawer.Navigator>
  );
};

export const RootNavigator = (): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: true,
    isSignout: false,
    userEmail: undefined,
  });

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userEmail = null;
      try {
        userEmail = await AsyncStorage.getItem(asyncStorageKeys);
        if (userEmail) {
          dispatch(restoreToken(userEmail));
        }
      } catch (e) {
        userEmail = '';
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (userEmail: string) => {
        dispatch(sigIn(userEmail));
      },
      signOut: () => dispatch(signOut()),
      signUp: async (userEmail: string) => {
        dispatch(sigIn(userEmail));
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      {state.userEmail === undefined ? <AuthenticationStack /> : <HomeDrawer />}
    </AuthContext.Provider>
  );
};
