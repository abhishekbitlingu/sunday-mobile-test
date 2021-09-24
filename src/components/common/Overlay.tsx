import {OverlayProps} from '@/types/Types';
import {colors} from '@/utils/constants.json';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  backdrop: {
    opacity: 0.4,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.uiBlack,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    borderRadius: 3,
    padding: 10,
    backgroundColor: colors.uiWhite,
  },
  androidShadow: {
    elevation: 2,
  },
  defaultShadow: {
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 4,
  },
});

export const Overlay: React.FC<OverlayProps> = (props): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(props.isVisible);

  useEffect(() => {
    setIsVisible(props.isVisible);
  }, [props.isVisible]);

  const handleMaskTouch = useCallback(() => {
    setIsVisible(false);
    props.onMaskTapped();
  }, [props]);

  return (
    <Modal visible={isVisible} transparent={true}>
      <TouchableWithoutFeedback onPress={handleMaskTouch}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.container} pointerEvents="box-none">
        <View
          style={[
            styles.overlay,
            Platform.OS === 'android'
              ? styles.androidShadow
              : styles.defaultShadow,
          ]}>
          {props.children}
        </View>
      </View>
    </Modal>
  );
};
