import {colors} from '@/utils/constants.json';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
});

export const LoadingIndicator = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.uiYellow} />
    </View>
  );
};
export default LoadingIndicator;
