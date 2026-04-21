import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NewsItem } from '../types';

interface DetailsScreenProps {
  route: {
    params: {
      item: NewsItem;
    };
  };
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});

export default DetailsScreen;