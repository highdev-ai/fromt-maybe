import React, { useCallback, useEffect } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import ApiService from '../services/api';
import { NewsItem } from '../types';
import GlassView from './GlassView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type DetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  item: NewsItem | null;
  mode?: 'sheet' | 'floating';
};

const DetailsModal: React.FC<DetailsModalProps> = ({ visible, onClose, item, mode = 'sheet' }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const close = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, {}, () => {
      runOnJS(onClose)();
    });
  }, [onClose, translateY]);

  const open = useCallback(() => {
    translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 180,
    });
  }, [translateY]);

  useEffect(() => {
    if (visible) open();
  }, [open, visible]);

  useEffect(() => {
    if (!item) return;

    ApiService.post('/api/interactions/event', {
      newsId: item.id,
      type: 'VIEW',
    });
  }, [item]);

  // 🔥 НОВИЙ gesture API
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, {
            damping: 20,
            stiffness: 180,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* backdrop */}
      <Pressable style={styles.overlay} onPress={close}>
        <View style={styles.backdrop} />
      </Pressable>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            mode === 'sheet' ? styles.sheet : styles.floating,
            animatedStyle,
          ]}
        >
          <GlassView style={styles.modal}>
            <View style={styles.handle} />

            {mode === 'sheet' ? (
              <>
                <Text style={styles.title}>{item.title}</Text>
                <Text numberOfLines={12} style={styles.content}>
                  {item.content}
                </Text>
              </>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
              </ScrollView>
            )}
          </GlassView>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: SCREEN_HEIGHT * 0.6,
  },
  floating: {
    position: 'absolute',
    top: '15%',
    left: 16,
    right: 16,
    maxHeight: '65%',
  },
  modal: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#aaa',
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default DetailsModal;
