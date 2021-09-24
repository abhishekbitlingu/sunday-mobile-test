import {OverlayRadioButtonsProps, RadioButtonOption} from '@/types/Types';
import {colors} from '@/utils/constants.json';
import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Overlay} from '@/components/common/Overlay';

const styles = StyleSheet.create({
  touchable: {
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    width: '70%',
    alignItems: 'center',
  },
  radioButtonContainer: {width: '15%'},
  outerCircle: {
    borderRadius: 10,
    borderWidth: 2,
    height: 16,
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.uiYellow,
  },
  innerCircle: {
    borderRadius: 6,
    borderWidth: 4,
    height: 6,
    width: 6,
    borderColor: colors.uiYellow,
  },
  label: {
    alignSelf: 'stretch',
    width: '80%',
  },
  radioButtonListContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
});

export const OverlayRadioButtons: React.FC<OverlayRadioButtonsProps> = (
  props,
): JSX.Element => {
  const handleMaskTap = useCallback(() => {
    props.onCancel();
  }, [props]);

  const handleOnPress = useCallback(
    (item: RadioButtonOption) => {
      props.onOptionSelected(item);
    },
    [props],
  );

  const renderItem = useCallback(
    (item: RadioButtonOption): JSX.Element => {
      return (
        <TouchableOpacity
          key={item.key}
          onPress={() => {
            handleOnPress(item);
          }}
          style={styles.touchable}>
          <View style={styles.container}>
            <View style={styles.radioButtonContainer}>
              <View style={styles.outerCircle}>
                {props.selectedOption === item.value && (
                  <View style={styles.innerCircle} />
                )}
              </View>
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [props.selectedOption, handleOnPress],
  );

  return (
    <Overlay isVisible={props.isVisible} onMaskTapped={handleMaskTap}>
      <View style={styles.radioButtonListContainer}>
        {props.options.map((item: RadioButtonOption) => {
          return renderItem(item);
        })}
        <View />
      </View>
    </Overlay>
  );
};
