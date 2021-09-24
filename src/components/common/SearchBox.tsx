import {SearchBoxProps} from '@/types/types';
import React, {useCallback} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTextBox: {
    paddingHorizontal: 10,
    flex: 1,
    fontSize: 18,
  },
});
export const SearchBox: React.FC<SearchBoxProps> = (
  props: SearchBoxProps,
): JSX.Element => {
  const handleFocus = (): void => {
    if (props.onFocus) {
      props.onFocus();
    }
  };

  const handleSubmit = (text: string): void => {
    if (props.onSubmitEditing) {
      props.onSubmitEditing(text);
    }
  };

  const handleOnChange = useCallback(
    (value: string): void => {
      if (props.deBounce && props.deBounce > 0) {
        setTimeout(() => {
          props.onChange(value, true);
        }, props.deBounce);
      } else {
        props.onChange(value);
      }
    },
    [props],
  );

  return (
    <View style={styles.container}>
      {props.iconComponent && (
        <View style={styles.iconContainer}>{props.iconComponent}</View>
      )}
      <TextInput
        style={styles.inputTextBox}
        autoFocus={props.autoFocus}
        onFocus={handleFocus}
        maxLength={props.maxLength}
        value={props.value}
        keyboardType={props.numKeyboard === undefined ? 'default' : 'numeric'}
        onChangeText={handleOnChange}
        onSubmitEditing={event => handleSubmit(event.nativeEvent.text)}
        placeholderTextColor={props.placeholderTextColor}
        placeholder={props.placeHolderText}
      />
    </View>
  );
};
