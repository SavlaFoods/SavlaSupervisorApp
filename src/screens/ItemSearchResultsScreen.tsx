import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './MainApp';
import Header from '../components/Header';
import { getToken } from '../utils/storage';
import { fetchSearchItems, ApiSearchItem, ApiError } from '../config/apiConfig';

// Add this entry to RootStackParamList in MainApp.tsx:
//   ItemSearchResultsScreen: {
//     customerId?: number;
//     customerName?: string;
//     unitId?: string | number;
//     unitName?: string;
//   };
//
// This is a NEW screen, separate from LotSearchResultsScreen, which is left
// untouched since it's already wired up elsewhere in the app.

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'ItemSearchResultsScreen'>;

const ItemSearchResultsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  const { customerId, customerName, unitId, unitName } = route.params || {};

  const [items, setItems] = useState<ApiSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!customerId) {
      setError('No customer selected.');
      setLoading(false);
      return;
    }
    loadItems();
  }, [customerId, unitId]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      console.log(
        '[ItemSearchResultsScreen] Fetching items for customerId:',
        customerId,
        'unitId:',
        unitId,
      );
      const data = await fetchSearchItems(
        customerId!,
        unitId,
        token || undefined,
      );
      setItems(data);
    } catch (err) {
      const apiErr = err as ApiError;
      console.error('[ItemSearchResultsScreen] Failed to load items:', err);
      setError(
        apiErr?.message ||
          (err instanceof Error ? err.message : 'Failed to load items.'),
      );
    } finally {
      setLoading(false);
    }
  };

  // Filters against whatever text-ish fields are present. Tighten this to
  // your real field names (e.g. ITEM_NAME, LOT_NO) once confirmed.
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item =>
      Object.values(item).some(
        val => typeof val === 'string' && val.toLowerCase().includes(q),
      ),
    );
  }, [items, searchQuery]);

  const handleSelectItem = (item: ApiSearchItem) => {
    // TODO: wire up navigation to a detail screen once you tell me what
    // tapping an item should do (e.g. navigate('LotDetailScreen', { item })).
    console.log('[ItemSearchResultsScreen] Selected item:', item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onMenuPress={() => navigation.goBack()} title="Search Results" />

      <View style={styles.subHeader}>
        {!!customerName && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>Customer: {customerName}</Text>
          </View>
        )}
        {!!unitName && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>Unit: {unitName}</Text>
          </View>
        )}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search results"
        placeholderTextColor="#999999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color="#1a5fb4" />
          <Text style={styles.loadingText}>Loading items...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerFill}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadItems}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) =>
            String(item.ITEM_ID ?? item.id ?? index)
          }
          initialNumToRender={20}
          maxToRenderPerBatch={30}
          windowSize={10}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.centerFill}>
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => handleSelectItem(item)}
            >
              <Text style={styles.itemName} numberOfLines={1}>
                {item.ITEM_NAME ?? item.name ?? 'Unnamed item'}
              </Text>
              {!!item.LOT_NO && (
                <Text style={styles.itemMeta}>Lot: {item.LOT_NO}</Text>
              )}
              {item.QTY !== undefined && (
                <Text style={styles.itemMeta}>Qty: {item.QTY}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  subHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  chip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: '#1a5fb4' },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  itemRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#ffffff',
  },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  itemMeta: { fontSize: 12, color: '#666666', marginTop: 2 },
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  loadingText: { marginTop: 10, fontSize: 13, color: '#666666' },
  emptyText: { fontSize: 13, color: '#999999' },
  errorText: {
    color: '#c0392b',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryText: {
    color: '#1a5fb4',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default ItemSearchResultsScreen;
