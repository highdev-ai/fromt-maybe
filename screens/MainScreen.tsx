import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import DetailsModal from '../components/DetailsModal';
import EmptyState from '../components/EmptyState';
import GlassView from '../components/GlassView';
import ItemCard from '../components/ItemCard';
import SkeletonList from '../components/SkeletonList';
import ApiService from '../services/api';
import { FeedCursor, FeedResponse, NewsItem } from '../types';

const categoryLabels: Record<string, string> = {
  all: 'All',
  general: 'General',
  world: 'World',
  nation: 'Nation',
  business: 'Business',
  technology: 'Technology',
  entertainment: 'Entertainment',
  sports: 'Sports',
  science: 'Science',
  health: 'Health',
};

type FeedParams = {
  size: number;
  category?: string;
  publishedAt?: string;
  id?: string;
};

const MainScreen: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = ['all', 'general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];

  const cursorRef = useRef<FeedCursor | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const skippedItemsRef = useRef<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const fetchItems = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoadingMore(true);
      }

      const params: FeedParams = {
        size: 20,
        ...(selectedCategory && { category: selectedCategory }),
      };

      const effectiveCursor = isRefresh ? null : cursorRef.current;

      if (effectiveCursor) {
        params.publishedAt = effectiveCursor.publishedAt;
        params.id = effectiveCursor.id;
      }

      const data = await ApiService.get<FeedResponse>('/api/feed', { params });
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

      cursorRef.current = data.nextCursor || null;
      setHasMore(!!data.nextCursor);
    } catch (e) {
      console.log('Fetch error:', e);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    cursorRef.current = null;
    setItems([]);
    setHasMore(true);
    setInitialLoading(true);
    fetchItems(true);
    onEndReachedCalledDuringMomentum.current = false;
  }, [fetchItems]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchItems(false);
    }
  };

  const handleItemPress = (item: NewsItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleLike = async (item: NewsItem) => {
    const newLiked = !item.liked;

    setItems(prev =>
      prev.map(i =>
        i.id === item.id ? { ...i, liked: newLiked } : i
      )
    );

    try {
      await ApiService.put('/api/interactions/like', {
        newsId: item.id,
        liked: newLiked,
      });
    } catch (e) {
      console.log('LIKE error:', e);

      setItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, liked: item.liked } : i
        )
      );
    }
  };

  const handleSkip = useCallback(async (item: NewsItem) => {
    if (skippedItemsRef.current.has(item.id)) return;

    skippedItemsRef.current.add(item.id);

    try {
      await ApiService.post('/api/interactions/event', {
        newsId: item.id,
        type: 'SKIP',
      });
    } catch (e) {
      console.log('SKIP error:', e);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  const onViewableItemsChanged = useRef(({ changed }: { changed: ViewToken[] }) => {
    changed.forEach((viewable) => {
      if (!viewable.isViewable) {
        handleSkip(viewable.item as NewsItem);
      }
    });
  });

  const renderItem = ({ item }: { item: NewsItem }) => (
    <ItemCard
      item={item}
      onPress={() => handleItemPress(item)}
      onLike={() => handleLike(item)}
      scrollY={scrollY}
    />
  );

  const renderHeader = () => (
    <GlassView style={styles.header} scrollY={scrollY}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => {
          const isActive =
            (cat === 'all' && !selectedCategory) ||
            selectedCategory === cat;

          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat === 'all' ? null : cat)}
              style={[
                styles.categoryButton,
                isActive ? styles.categoryActive : styles.categoryInactive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive ? styles.categoryTextActive : styles.categoryTextInactive,
                ]}
              >
                {categoryLabels[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </GlassView>
  );

  if (initialLoading) return <SkeletonList />;

  if (items.length === 0) {
    return <EmptyState onRefresh={() => fetchItems(true)} />;
  }

  return (
    <AnimatedBackground>
      <FlatList
        data={items}
        style={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
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
          cursorRef.current = null;
          fetchItems(true);
        }}
        contentContainerStyle={styles.listContainer}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onScroll={(e) => {
          setScrollY(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        viewabilityConfig={viewabilityConfig}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color="#344054" style={styles.footerLoader} /> : null
        }
      />
      <DetailsModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
      />
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
  list: {
    backgroundColor: 'transparent',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryActive: {
    backgroundColor: 'rgba(50,64,82,0.78)',
    borderColor: 'rgba(255,255,255,0.62)',
  },
  categoryInactive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.48)',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#f8fafc',
  },
  categoryTextInactive: {
    color: '#344054',
  },
  footerLoader: {
    margin: 16,
  },
});

export default MainScreen;
