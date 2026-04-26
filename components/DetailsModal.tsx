import React, { useCallback, useEffect } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import ApiService from '../services/api';
import { NewsItem } from '../types';
import GlassView from './GlassView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const RAISED_OFFSET = -SCREEN_HEIGHT * 0.2;
const CLOSE_THRESHOLD = 100;
const RAISE_THRESHOLD = -80;
const TIMING_CONFIG = {
  duration: 220,
  easing: Easing.linear,
};

type DetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  item: NewsItem | null;
  mode?: 'sheet' | 'floating';
};

const DetailsModal: React.FC<DetailsModalProps> = ({ visible, onClose, item, mode = 'floating' }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const gestureStartY = useSharedValue(0);

  const close = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, TIMING_CONFIG, () => {
      runOnJS(onClose)();
    });
  }, [onClose, translateY]);

  const open = useCallback(() => {
    translateY.value = withTiming(0, TIMING_CONFIG);
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
  const openSource = useCallback(async () => {
    if (!item?.url) return;

    try {
      await Linking.openURL(item.url);
    } catch (e) {
      console.log('Open source error:', e);
    }
  }, [item?.url]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      gestureStartY.value = translateY.value;
    })
    .onUpdate((e) => {
      const nextY = gestureStartY.value + e.translationY;
      translateY.value = Math.min(SCREEN_HEIGHT, Math.max(RAISED_OFFSET, nextY));
    })
    .onEnd((e) => {
      if (e.translationY > CLOSE_THRESHOLD) {
        runOnJS(close)();
      } else if (e.translationY < RAISE_THRESHOLD || translateY.value <= RAISED_OFFSET / 2) {
        translateY.value = withTiming(RAISED_OFFSET, TIMING_CONFIG);
      } else {
        translateY.value = withTiming(0, TIMING_CONFIG);
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
              <View style={styles.contentStack}>
                <Text style={styles.title}>{item.title}</Text>
                <Text numberOfLines={12} style={styles.content}>
                  {item.content}
                </Text>
                <TouchableOpacity style={styles.sourceButton} onPress={openSource} disabled={!item.url}>
                  <Text style={styles.sourceButtonText}>Open full article</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
                <TouchableOpacity style={styles.sourceButton} onPress={openSource} disabled={!item.url}>
                  <Text style={styles.sourceButtonText}>Open full article</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(39,55,33,0.34)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: SCREEN_HEIGHT * 0.6,
  },
  floating: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    left: 16,
    right: 16,
  },
  modal: {
    flex: 1,
    borderRadius: 28,
    padding: 22,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(112,128,90,0.48)',
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#263323',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#52624c',
  },
  contentStack: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  sourceButton: {
    minHeight: 48,
    marginTop: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.62)',
    backgroundColor: 'rgba(246,252,239,0.3)',
  },
  sourceButtonText: {
    color: '#42513d',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default DetailsModal;
