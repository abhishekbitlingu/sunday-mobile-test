import {
  CreateAccountProps,
  CreateAccountScreenNavigationProp,
  User,
} from '@/types/Types';
import {useNavigation} from '@react-navigation/core';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  colors,
  screenTitles,
  strings,
  asyncStorageKeys,
  errorMessages,
} from '@/utils/constants.json';
import {FloatingInputText} from '@/components/common/FloatingInputText';
import ProfileIcon from 'react-native-vector-icons/Feather';
import EmailIcon from 'react-native-vector-icons/FontAwesome';
import PasswordIcon from 'react-native-vector-icons/SimpleLineIcons';
import ArrowIcon from 'react-native-vector-icons/AntDesign';
import BackIcon from 'react-native-vector-icons/AntDesign';
import AppUtilities from '@/utils/AppUtilities';
import {
  createTable,
  getDBConnection,
  saveUser,
} from '@/local-storage/SQLiteHelper';
import {AuthContext} from '@/components/navigation/Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingIndicator from '@/components/common/LoadingIndicator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    borderRadius: 10,
    backgroundColor: colors.uiWhite,
    justifyContent: 'space-between',
  },
  innerContainer: {
    alignSelf: 'stretch',
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
    justifyContent: 'flex-start',
  },
  floatingInputContainer: {
    marginVertical: 15,
  },
  formContainer: {
    justifyContent: 'space-between',
  },
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
  headerBackButton: {
    alignSelf: 'flex-start',
    marginVertical: 40,
  },
  scrollview: {
    flex: 1,
    backgroundColor: colors.uiWhite,
  },
});

export const CreateAccount: React.FC<CreateAccountProps> = (): JSX.Element => {
  const {signUp} = useContext(AuthContext);
  const navigation = useNavigation<CreateAccountScreenNavigationProp>();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    let isError: boolean;
    let errorTitle: string;
    let errorMessage: string;
    if (AppUtilities.isEmpty(fullName)) {
      isError = true;
      errorTitle = errorMessages.invalidFullnameTitle;
      errorMessage = errorMessages.invalidFullnameMessage;
    } else if (AppUtilities.isEmpty(email)) {
      isError = true;
      errorTitle = errorMessages.invalidEmailTitle;
      errorMessage = errorMessages.emailCannotBeEmptyMessage;
    } else if (!AppUtilities.isValidEmail(email)) {
      isError = true;
      errorTitle = errorMessages.invalidEmailTitle;
      errorMessage = errorMessages.invalidEmailMessage;
    } else if (AppUtilities.isEmpty(password)) {
      isError = true;
      errorTitle = errorMessages.invalidPasswordTitle;
      errorMessage = errorMessages.passwordCannotBeEmpty;
    } else if (AppUtilities.isEmpty(confirmPassword)) {
      isError = true;
      errorTitle = errorMessages.invalidPasswordTitle;
      errorMessage = errorMessages.confPasswordCannotBeEmpty;
    } else if (password.trim() !== confirmPassword.trim()) {
      isError = true;
      errorTitle = errorMessages.passwordDoNotMatchTitle;
      errorMessage = errorMessages.passwordDoNotMatchMessage;
    } else {
      isError = false;
      errorTitle = '';
      errorMessage = '';
    }

    if (isError) {
      AppUtilities.showAlert(errorMessage, errorTitle, 'Ok');
    } else {
      let result;
      try {
        setIsLoading(true);
        const db = await getDBConnection();
        await createTable(db);
        const newUser: User = {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
        };
        console.log(newUser);
        result = await saveUser(db, newUser);
        if (result) {
          await AsyncStorage.setItem(
            asyncStorageKeys,
            email.trim().toLowerCase(),
          );
          setIsLoading(false);
          signUp(email);
        } else {
          setIsLoading(false);
          AppUtilities.showAlert(
            errorMessages.failedToSignUp,
            strings.information,
          );
        }
      } catch {
        setIsLoading(false);
        AppUtilities.showAlert(
          errorMessages.failedToSignUp,
          strings.information,
        );
      }
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <KeyboardAwareScrollView
        extraHeight={10}
        contentContainerStyle={styles.scrollview}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => {
                navigation.goBack();
              }}>
              <BackIcon name={'arrowleft'} size={25} color={colors.uiGray} />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                {screenTitles.createAccount}
              </Text>
            </View>
            <View style={styles.formContainer}>
              <View>
                <View style={styles.floatingInputContainer}>
                  <FloatingInputText
                    onChange={value => {
                      setFullName(value);
                    }}
                    placeholderTextColor={colors.uiGray}
                    placeHolderText={strings.fullNameTitle}
                    value={fullName}
                    iconComponent={
                      <ProfileIcon
                        name={'user'}
                        size={17}
                        color={
                          fullName.length > 0 ? colors.uiBlack : colors.uiGray
                        }
                      />
                    }
                  />
                </View>
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
                        color={
                          email.length > 0 ? colors.uiBlack : colors.uiGray
                        }
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
                <View style={styles.floatingInputContainer}>
                  <FloatingInputText
                    onChange={value => {
                      setConfirmPassword(value);
                    }}
                    secureTextEntry
                    placeholderTextColor={colors.uiGray}
                    placeHolderText={strings.confirmPassword}
                    value={confirmPassword}
                    iconComponent={
                      <PasswordIcon
                        name={'lock'}
                        size={16}
                        color={
                          confirmPassword.length > 0
                            ? colors.uiBlack
                            : colors.uiGray
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
                    {strings.signUp.toUpperCase()}
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
            <Text style={styles.noAccountText}>
              {strings.alreadyHaveAccount}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.goBack()}>
              <Text style={[styles.noAccountText, styles.clickableLinkText]}>
                {strings.signIn}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
};
