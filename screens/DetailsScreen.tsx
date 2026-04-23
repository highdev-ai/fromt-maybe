import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NewsItem } from '../types';
import ApiService from '../services/api';

interface DetailsScreenProps {
  route: {
    params: {
      item: NewsItem;
    };
  };
}

const DetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { item } = route.params;

  // щоб не відправляти VIEW кілька разів
  const hasSentView = useRef(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await ApiService.post('/api/interactions/event', {
          newsId: item.id,
          type: 'VIEW',
        });
      } catch (e) {
        console.log('VIEW error:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.content}>{item.content}</Text>

      {item.url && (
        <Text style={styles.url}>{item.url}</Text>
      )}
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
  url: {
    marginTop: 20,
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default DetailsScreen;