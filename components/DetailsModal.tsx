import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ApiService from '../services/api';
import GlassView from './GlassView';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const DetailsModal = ({ visible, onClose, item }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // 👉 swipe logic
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 10,

      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          // close
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // return назад
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // 👉 відкриття анімації
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 👉 VIEW interaction
  useEffect(() => {
    if (!item) return;

    ApiService.post('/api/interactions/event', {
      newsId: item.id,
      type: 'VIEW',
    });
  }, [item]);

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* затемнення */}
        <View style={styles.backdrop} />

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          <GlassView style={styles.modal}>
            <View style={styles.handle} />

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </ScrollView>
          </GlassView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    height: '85%',
  },

  modal: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default DetailsModal;