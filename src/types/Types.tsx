import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ColorValue} from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

export type LoginProps = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp;
};

export type CreateAccountScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateAccount'
>;

export type CreateAccountScreenRouteProp = RouteProp<
  RootStackParamList,
  'CreateAccount'
>;

export type CreateAccountProps = {
  route: CreateAccountScreenRouteProp;
  navigation: CreateAccountScreenNavigationProp;
};

export type HomeDrawerParamList = {
  CountryListStack: CountryStackScreenProp;
  UserListStack: UserStackScreenProp;
};

export type CountryStackNavigationProp = DrawerNavigationProp<
  HomeDrawerParamList,
  'CountryListStack'
>;

export type CountryStackRouteProp = RouteProp<
  HomeDrawerParamList,
  'CountryListStack'
>;

export type CountryStackScreenProp = {
  route: CountryStackRouteProp;
  navigation: CountryStackNavigationProp;
};

export type UserStackNavigationProp = DrawerNavigationProp<
  HomeDrawerParamList,
  'CountryListStack'
>;

export type UserStackRouteProp = RouteProp<
  HomeDrawerParamList,
  'CountryListStack'
>;

export type UserStackScreenProp = {
  route: UserStackRouteProp;
  navigation: UserStackNavigationProp;
};

export type UserStackParamList = {
  UserList: undefined;
};
export type CountryStackParamList = {
  CountryList: undefined;
  PlayerList: {
    headerTitle: string;
    players: Player[];
  };
};

export type CountryListScreenNavigationProp = StackNavigationProp<
  CountryStackParamList,
  'CountryList'
>;

export type CountryListScreenRouteProp = RouteProp<
  CountryStackParamList,
  'CountryList'
>;

export type CountryListProps = {
  route: CountryListScreenRouteProp;
  navigation: CountryListScreenNavigationProp;
};

export type PlayerListScreenNavigationProp = StackNavigationProp<
  CountryStackParamList,
  'PlayerList'
>;

export type PlayerListScreenRouteProp = RouteProp<
  CountryStackParamList,
  'PlayerList'
>;

export type PlayerListProps = {
  route: PlayerListScreenRouteProp;
  navigation: PlayerListScreenNavigationProp;
};

export type UserListScreenNavigationProp = StackNavigationProp<
  UserStackParamList,
  'UserList'
>;

export type UserListScreenRouteProp = RouteProp<UserStackParamList, 'UserList'>;

export type UserListProps = {
  route: UserListScreenRouteProp;
  navigation: UserListScreenNavigationProp;
};

export type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
};

export type SearchBoxProps = {
  onChange: (value: string, isDelayed?: boolean) => void;
  onFocus?: () => void;
  onSubmitEditing?: (text: string) => void;
  autoFocus?: boolean;
  maxLength?: number;
  value?: string;
  numKeyboard?: boolean;
  placeHolderText?: string;
  iconComponent?: JSX.Element;
  placeholderTextColor?: ColorValue;
  deBounce?: number;
};

export type Player = {
  name: string;
  captain: boolean;
};

export type CountryResponse = {
  [key: string]: Player[];
};

export type Country = {
  name: string;
  players: Player[];
};

export type RadioButtonOption = {
  key: string;
  value: number;
  label: string;
};

export type CountryListItemProps = {
  data: Country;
  onPress: (country: Country) => void;
};

export type OverlayProps = {
  isVisible: boolean;
  onMaskTapped: () => void;
};

export type OverlayRadioButtonsProps = {
  isVisible: boolean;
  options: RadioButtonOption[];
  onOptionSelected: (selectedOption: RadioButtonOption) => void;
  onCancel: () => void;
  selectedOption: number;
};
