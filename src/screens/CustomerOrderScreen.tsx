import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './MainApp';
import Header from '../components/Header';
import { getUserData, getToken } from '../utils/storage';
import {
  fetchAllCustomers,
  ApiCustomer,
  ApiError,
  API_ENDPOINTS,
} from '../config/apiConfig';

// Add this entry to RootStackParamList in MainApp.tsx:
//   CustomerOrderScreen: { unitName?: string; unitId?: number };
//
// And add a NEW entry for the screen this now navigates to (separate from
// LotSearchResultsScreen, which is left untouched — it's already wired up
// elsewhere):
//   ItemSearchResultsScreen: {
//     customerId?: number;
//     customerName?: string;
//     unitId?: string | number;
//     unitName?: string;
//   };

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'CustomerOrderScreen'>;

const CustomerOrderScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  // Unit passed from HomeScreen. If it wasn't passed, fall back to the
  // unit stored at login/company-selection (same fields
  // LotSearchResultsScreen already reads).
  const [unitName, setUnitName] = useState<string | undefined>(
    route.params?.unitName,
  );
  const [unitId, setUnitId] = useState<string | number | undefined>(
    route.params?.unitId,
  );

  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pickerVisible, setPickerVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
    loadUnitFallback();
  }, []);

  const loadUnitFallback = async () => {
    if (route.params?.unitName && route.params?.unitId) return;
    try {
      const storedUser = await getUserData();
      if (!route.params?.unitName && storedUser?.selectedUnit?.UnitName) {
        setUnitName(storedUser.selectedUnit.UnitName);
      }
      if (!route.params?.unitId && storedUser?.selectedUnit?.UnitId) {
        setUnitId(storedUser.selectedUnit.UnitId);
      }
    } catch (err) {
      console.error('[CustomerOrderScreen] Error reading stored unit:', err);
    }
  };

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      console.log(
        '[CustomerOrderScreen] Fetching customers from:',
        API_ENDPOINTS.ALL_CUSTOMERS,
        'with token?',
        !!token,
      );
      const data = await fetchAllCustomers(token || undefined);
      setCustomers(data);
    } catch (err) {
      const apiErr = err as ApiError;
      console.error('[CustomerOrderScreen] Failed to load customers:', err);
      setError(
        apiErr?.message ||
          (err instanceof Error ? err.message : 'Failed to load customers.'),
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      c =>
        c.DISP_NAME.toLowerCase().includes(q) ||
        c.CUSTOMER_NAME.toLowerCase().includes(q),
    );
  }, [customers, searchQuery]);

  // Selecting a customer goes straight to ItemSearchResultsScreen, which
  // auto-runs a customer-scoped SearchItems call the moment it mounts — no
  // extra tap, no typing anything first.
  const handleSelectCustomer = (customer: ApiCustomer) => {
    setPickerVisible(false);
    navigation.replace('ItemSearchResultsScreen', {
      customerId: customer.FK_CUSTOMER_ID,
      customerName: customer.DISP_NAME,
      unitId,
      unitName,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onMenuPress={() => navigation.goBack()} title="Customer Order" />

      {/* Centered picker trigger — the screen's job is just "pick a
          customer", so it stays minimal and centered rather than a long
          form. */}
      <View style={styles.centerBody}>
        {!!unitName && (
          <View style={styles.unitChip}>
            <Text style={styles.unitChipText}>Unit: {unitName}</Text>
          </View>
        )}

        <Text style={styles.title}>Select a customer</Text>
        <Text style={styles.subtitle}>
          Choose a customer to view their lots
        </Text>

        <TouchableOpacity
          style={styles.dropdownField}
          activeOpacity={0.7}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.dropdownFieldText}>Select customer</Text>
          <Text style={styles.dropdownChevron}>▾</Text>
        </TouchableOpacity>

        {error && !loading && (
          <TouchableOpacity onPress={loadCustomers} style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorRetryText}>Tap to retry</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={pickerVisible}
        animationType="slide"
        onRequestClose={() => {
          setPickerVisible(false);
          navigation.goBack();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Customer</Text>
            <TouchableOpacity
              onPress={() => {
                setPickerVisible(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name"
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />

          {loading ? (
            <View style={styles.centerFill}>
              <ActivityIndicator size="large" color="#1a5fb4" />
              <Text style={styles.loadingText}>Loading customers...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerFill}>
              <Text style={styles.errorTextModal}>{error}</Text>
              <TouchableOpacity onPress={loadCustomers}>
                <Text style={styles.retryTextModal}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredCustomers}
              keyExtractor={item => String(item.FK_CUSTOMER_ID)}
              initialNumToRender={20}
              maxToRenderPerBatch={30}
              windowSize={10}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.centerFill}>
                  <Text style={styles.emptyText}>No customers found</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.customerRow}
                  onPress={() => handleSelectCustomer(item)}
                >
                  <Text style={styles.customerRowName} numberOfLines={1}>
                    {item.DISP_NAME}
                  </Text>
                  <Text style={styles.customerRowMeta}>
                    #{item.FK_CUSTOMER_ID}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  unitChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 16,
  },
  unitChipText: { fontSize: 12, fontWeight: '600', color: '#1a5fb4' },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    width: '100%',
  },
  dropdownFieldText: { fontSize: 15, color: '#999999', flex: 1 },
  dropdownChevron: { fontSize: 16, color: '#666666' },
  errorBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: '#fdecea',
    borderRadius: 6,
    width: '100%',
  },
  errorText: { color: '#c0392b', fontSize: 12, fontWeight: '600' },
  errorRetryText: {
    color: '#c0392b',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  // Modal / picker
  modalContainer: { flex: 1, backgroundColor: '#ffffff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  modalClose: { fontSize: 14, color: '#1a5fb4', fontWeight: '600' },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a1a',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  customerRowName: { fontSize: 14, color: '#1a1a1a', flex: 1, marginRight: 8 },
  customerRowMeta: { fontSize: 11, color: '#999999', fontWeight: '600' },
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: { marginTop: 10, fontSize: 13, color: '#666666' },
  emptyText: { fontSize: 13, color: '#999999' },
  errorTextModal: {
    color: '#c0392b',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryTextModal: {
    color: '#1a5fb4',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default CustomerOrderScreen;
