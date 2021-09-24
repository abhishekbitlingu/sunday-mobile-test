import {CountryListItemProps} from '@/types/types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countrynametext: {
    flex: 1,
    fontSize: 18,
    padding: 10,
  },
  playerCount: {
    fontSize: 18,
    paddingHorizontal: 15,
  },
});
export const CountryListItem: React.FC<CountryListItemProps> = (
  props,
): JSX.Element => {
  const handleOnPress = (): void => {
    props.onPress(props.data);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOnPress}>
      <Text style={styles.countrynametext}>{props.data.name}</Text>
      <Text style={styles.playerCount}>{'+' + props.data.players.length}</Text>
    </TouchableOpacity>
  );
};
