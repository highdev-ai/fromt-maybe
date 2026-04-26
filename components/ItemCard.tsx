import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlassView from './GlassView';
import { NewsItem } from '../types';

interface ItemCardProps {
  item: NewsItem;
  onLike: () => void;
  onPress: () => void;
  scrollY: number;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onLike, onPress, scrollY }) => {
  const content = item.content || '';
  const truncatedContent =
    content.length > 100 ? `${content.substring(0, 100)}...` : content;

  return (
    <GlassView style={styles.card} scrollY={scrollY}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.content} numberOfLines={2}>
          {truncatedContent}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.category}>{item.category}</Text>

          <TouchableOpacity style={styles.likeButton} onPress={onLike}>
            <Text style={[styles.likeText, item.liked && styles.likeTextActive]}>
              {item.liked ? 'Love' : 'Like'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2933',
  },
  content: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  likeButton: {
    minWidth: 58,
    minHeight: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.54)',
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  likeText: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '700',
  },
  likeTextActive: {
    color: '#9f1239',
  },
});

export default ItemCard;
