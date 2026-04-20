import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ApiService from '../services/api';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

interface MainScreenProps {
  navigation: any;
}

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.get<Item[]>('/items');
      setItems(data);
    } catch (err: any) {
      console.log(err);
      setItems([]);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle item press to navigate to details
  const handleItemPress = (item: Item) => {
    navigation.navigate('Details', { item });
  };

  // Render item in FlatList
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <ItemCard item={item} />
    </TouchableOpacity>
  );

  // Handle refresh
  const handleRefresh = () => {
    fetchItems();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (items.length === 0) {
    return <EmptyState onRefresh={handleRefresh} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onRefresh={handleRefresh}
        refreshing={loading}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MainScreen;