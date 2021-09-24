import React, {useCallback, useState} from 'react';
import {
  ColorValue,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '@/utils/constants.json';

const styles = StyleSheet.create({
  shadowContainerStyle: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 4,
      },
    }),
    backgroundColor: colors.uiWhite,
    minHeight: 58,
  },
  mainContainer: {
    flexDirection: 'row',
  },
  noShadow: {
    alignItems: 'flex-start',
  },
  inputTextBox: {
    flex: 1,
    color: 'black',
    alignSelf: 'stretch',
    fontWeight: '700',
    fontSize: 14,
  },
  inputTextContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 7,
  },
  floatingLabel: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 5,
  },
  underline: {
    alignSelf: 'stretch',
    marginHorizontal: 8,
    marginBottom: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.uiGray,
  },
  iconContainer: {
    padding: 8,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  clickableLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.uiYellow,
    paddingHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {flex: 1},
});

type FloatongInputTextProps = {
  onChange: (value: string, isDelayed?: boolean) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: (text: string) => void;
  onRightButtonClick?: () => void;
  autoFocus?: boolean;
  maxLength?: number;
  value?: string;
  numKeyboard?: boolean;
  placeHolderText?: string;
  iconComponent?: JSX.Element;
  placeholderTextColor?: ColorValue;
  deBounce?: number;
  rightButtonText?: string;
  secureTextEntry?: boolean;
};
export const FloatingInputText: React.FC<FloatongInputTextProps> = ({
  autoFocus = false,
  value = '',
  placeHolderText = '',
  iconComponent,
  maxLength,
  numKeyboard,
  placeholderTextColor,
  deBounce,
  onFocus,
  onBlur,
  onChange,
  onSubmitEditing,
  rightButtonText,
  onRightButtonClick,
  secureTextEntry,
}): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(autoFocus);
  const handleFocus = (): void => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleOnChange = useCallback(
    (text: string): void => {
      if (deBounce && deBounce > 0) {
        setTimeout(() => {
          onChange(text, true);
        }, deBounce);
      } else {
        onChange(text);
      }
    },
    [deBounce, onChange],
  );

  const handleSubmit = (text: string): void => {
    if (onSubmitEditing) {
      onSubmitEditing(text);
    }
  };

  const handleRightButtonClick = (): void => {
    if (onRightButtonClick) {
      onRightButtonClick();
    }
  };
  return (
    <View style={isFocused ? styles.shadowContainerStyle : styles.noShadow}>
      <View style={styles.mainContainer}>
        {iconComponent && (
          <View style={[styles.iconContainer, styles.justifyCenter]}>
            {isFocused && <View style={styles.icon} />}
            <View
              style={[
                styles.icon,
                isFocused ? styles.justifyStart : styles.justifyCenter,
              ]}>
              {iconComponent}
            </View>
          </View>
        )}
        <View style={styles.inputTextContainer}>
          {(isFocused || value.length > 0) && placeHolderText.length > 0 && (
            <Text
              style={[
                styles.floatingLabel,
                {
                  color: placeholderTextColor
                    ? placeholderTextColor
                    : colors.uiBlack,
                },
              ]}>
              {placeHolderText.toUpperCase()}
            </Text>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputTextBox}
              autoFocus={autoFocus}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={maxLength}
              value={value}
              secureTextEntry={secureTextEntry}
              keyboardType={numKeyboard === undefined ? 'default' : 'numeric'}
              onChangeText={handleOnChange}
              onSubmitEditing={event => handleSubmit(event.nativeEvent.text)}
              placeholderTextColor={placeholderTextColor}
              placeholder={isFocused ? '' : placeHolderText.toUpperCase()}
            />
            {rightButtonText && (
              <TouchableOpacity onPress={handleRightButtonClick}>
                <Text style={styles.clickableLinkText}>{rightButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={styles.underline} />
    </View>
  );
};
