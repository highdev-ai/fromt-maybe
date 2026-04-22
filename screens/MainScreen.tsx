import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ApiService from '../services/api';
import { NewsItem, FeedResponse } from '../types';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

interface MainScreenProps {
  navigation: any;
}

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = ['all', 'general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];

  const [cursor, setCursor] = useState<{
    publishedAt: string;
    id: string;
  } | null>(null);

  const [hasMore, setHasMore] = useState(true);

  // 🔥 важливо для FlatList
  const onEndReachedCalledDuringMomentum = useRef(false);

  const fetchItems = async (isRefresh = false, cursorOverride: typeof cursor = null) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (!isRefresh) {
        setLoadingMore(true);
      }

      const params: any = {
        ...(selectedCategory && { category: selectedCategory }),
      };

      const effectiveCursor = isRefresh ? null : (cursorOverride ?? cursor);

      if (effectiveCursor) {
        params.publishedAt = effectiveCursor.publishedAt;
        params.id = effectiveCursor.id;
      }

      const data = await ApiService.get<FeedResponse>('/api/news/feed', {
        params,
      });

      const newItems = data.items;

      if (isRefresh) {
        setItems(newItems);
      } else {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const filtered = newItems.filter((i) => !existingIds.has(i.id));
          return [...prev, ...filtered];
        });
      }

      setCursor(data.nextCursor || null);
      setHasMore(!!data.nextCursor);
    } catch (e) {
      console.log('Fetch error:', e);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setCursor(null);
    setItems([]);
    setHasMore(true);
    setInitialLoading(true);
    fetchItems(true, null);
  }, [selectedCategory]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchItems(false, cursor);
    }
  };

  const handleItemPress = (item: NewsItem) => {
    navigation.navigate('Details', { item });
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <ItemCard item={item} />
    </TouchableOpacity>
  );

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  if (items.length === 0) {
    return <EmptyState onRefresh={() => fetchItems(true, null)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News</Text>

      <View style={{ flexDirection: 'row', padding: 10 }}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat === 'all' ? null : cat)}
            style={{
              padding: 8,
              marginRight: 8,
              backgroundColor:
                (cat === 'all' && !selectedCategory) ||
                selectedCategory === cat
                  ? '#007bff'
                  : '#ccc',
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#fff' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            loadMore();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => {
          setCursor(null);
          fetchItems(true, null);
        }}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : null
        }
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
});

export default MainScreen;