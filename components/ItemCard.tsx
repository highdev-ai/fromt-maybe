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

          <TouchableOpacity onPress={onLike}>
            <Text style={{ color: item.liked ? 'red' : 'gray', fontSize: 18 }}>
              ♥
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 12,
    color: '#999',
  },
});

export default ItemCard;