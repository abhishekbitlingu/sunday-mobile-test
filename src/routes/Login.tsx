import {LoginProps, LoginScreenNavigationProp, User} from '@/types/Types';
import {useNavigation} from '@react-navigation/core';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  colors,
  screenTitles,
  strings,
  asyncStorageKeys,
} from '@/utils/constants.json';
import {FloatingInputText} from '@/components/common/FloatingInputText';
import EmailIcon from 'react-native-vector-icons/FontAwesome';
import PasswordIcon from 'react-native-vector-icons/SimpleLineIcons';
import ArrowIcon from 'react-native-vector-icons/AntDesign';
import AppUtilities from '@/utils/AppUtilities';
import {getDBConnection, getUser} from '@/local-storage/SQLiteHelper';
import {AuthContext} from '@/components/navigation/Navigator';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    borderRadius: 10,
    backgroundColor: colors.uiWhite,
    justifyContent: 'space-between',
  },
  innerContainer: {
    justifyContent: 'flex-start',
  },
  headerText: {
    fontSize: 30,
    fontWeight: '800',
    paddingVertical: 5,
  },
  descriptionText: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 5,
    color: colors.uiGray,
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  noAccountText: {
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 5,
    color: colors.uiGray,
  },
  clickableLinkText: {
    fontWeight: '700',
    color: colors.uiYellow,
    paddingHorizontal: 5,
  },
  headerContainer: {
    height: 150,
    marginVertical: 40,
    justifyContent: 'flex-end',
  },
  floatingInputContainer: {
    marginVertical: 15,
  },
  formContainer: {},
  buttonMaincontainer: {
    alignItems: 'flex-start',
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: colors.uiYellow,
    borderRadius: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    color: colors.uiWhite,
    padding: 10,
  },
});

export const Login: React.FC<LoginProps> = (): JSX.Element => {
  const {signIn} = useContext(AuthContext);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    let isError: boolean;
    let errorTitle: string;
    let errorMessage: string;
    if (AppUtilities.isEmpty(email)) {
      isError = true;
      errorTitle = 'Invalid Email';
      errorMessage = 'Email cannot be empty';
    } else if (!AppUtilities.isValidEmail(email)) {
      isError = true;
      errorTitle = 'Invalid Email';
      errorMessage = "Email you've entered is not valid";
    } else if (AppUtilities.isEmpty(password)) {
      isError = true;
      errorTitle = 'Invalid Password';
      errorMessage = 'Password cannot be empty';
    } else {
      isError = false;
      errorTitle = '';
      errorMessage = '';
    }

    if (isError) {
      AppUtilities.showAlert(errorMessage, errorTitle, 'Ok');
    } else {
      let shouldUserLogIn = false;
      try {
        setIsLoading(true);
        const db = await getDBConnection();
        const results = await getUser(db, email.trim().toLowerCase());
        results.forEach(result => {
          for (let index = 0; index < result.rows.length; index++) {
            const user = result.rows.item(index) as User;
            if (user.password === password) {
              shouldUserLogIn = true;
              break;
            }
          }
        });
      } catch {}
      setIsLoading(false);
      if (shouldUserLogIn) {
        await AsyncStorage.setItem(
          asyncStorageKeys,
          email.toLowerCase().trim(),
        );
        signIn(email.toLowerCase().trim());
      } else {
        AppUtilities.showAlert(
          'Email and Password does not match any of our records. Please try with a different user',
          'Information',
          'Ok',
        );
      }
    }
  };
  if (isLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{screenTitles.login}</Text>
            <Text style={styles.descriptionText}>
              {strings.loginDescription}
            </Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.formContainer}>
              <View style={styles.floatingInputContainer}>
                <FloatingInputText
                  onChange={value => {
                    setEmail(value);
                  }}
                  placeholderTextColor={colors.uiGray}
                  placeHolderText={strings.emailTitle}
                  value={email}
                  iconComponent={
                    <EmailIcon
                      name={'envelope-o'}
                      size={14}
                      color={email.length > 0 ? colors.uiBlack : colors.uiGray}
                    />
                  }
                />
              </View>
              <View style={styles.floatingInputContainer}>
                <FloatingInputText
                  onChange={value => {
                    setPassword(value);
                  }}
                  secureTextEntry
                  placeholderTextColor={colors.uiGray}
                  placeHolderText={strings.passwordTitle}
                  rightButtonText={strings.forgotPasswordLink.toUpperCase()}
                  value={password}
                  iconComponent={
                    <PasswordIcon
                      name={'lock'}
                      size={16}
                      color={
                        password.length > 0 ? colors.uiBlack : colors.uiGray
                      }
                    />
                  }
                />
              </View>
            </View>
            <View style={styles.buttonMaincontainer}>
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.5}
                style={styles.buttonContainer}>
                <Text style={styles.buttonText}>
                  {screenTitles.login.toUpperCase()}
                </Text>
                <ArrowIcon
                  name={'arrowright'}
                  size={20}
                  color={colors.uiWhite}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.noAccountText}>{strings.doNotHaveAccount}</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('CreateAccount');
            }}>
            <Text style={[styles.noAccountText, styles.clickableLinkText]}>
              {strings.signUp}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};
