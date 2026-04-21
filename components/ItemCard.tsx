import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NewsItem } from '../types';

interface ItemCardProps {
  item: NewsItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  // Truncate content for preview
  const content = item.content || '';
  const truncatedContent = content.length > 100
    ? `${content.substring(0, 100)}...`
    : content;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {truncatedContent}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
});

export default ItemCard;