import {Alert} from 'react-native';

export default class AppUtilities {
  static showAlert = (
    message: string,
    title?: string,
    positiveButtonText?: string,
    onPositiveButtonPress?: () => void,
    negativeButtonText?: string,
    onNegativeButtonPress?: () => void,
  ): void => {
    let buttonArray = [];
    buttonArray.push({
      text: positiveButtonText ? positiveButtonText : 'Ok',
      onPress: () => {
        onPositiveButtonPress
          ? onPositiveButtonPress()
          : console.log('On Ok pressed function not available');
      },
    });
    if (negativeButtonText) {
      buttonArray.push({
        text: negativeButtonText ? negativeButtonText : 'Cancel',
        onPress: () => {
          onNegativeButtonPress
            ? onNegativeButtonPress()
            : console.log('On Cancel pressed function not available');
        },
      });
    }
    Alert.alert(title ? title : 'Alert', message ? message : '', buttonArray);
  };

  static isEmpty = (value: string): boolean => {
    return value.toString().trim().length <= 0;
  };

  static isValidEmail = (value: string): boolean => {
    let regexp = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regexp.test(value);
  };

  static compare = (
    param1: string | number,
    param2: string | number,
  ): number => {
    const first = typeof param1 === 'string' ? param1.toLowerCase() : param1;
    const second = typeof param2 === 'string' ? param2.toLowerCase() : param2;
    if (first < second) {
      return -1;
    } else if (first > second) {
      return 1;
    }
    return 0;
  };
}
