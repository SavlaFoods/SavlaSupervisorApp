import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './MainApp';
import { getUserData, getToken } from '../utils/storage';
import { COLORS } from '../theme/colors';
import {
  API_ENDPOINTS,
  getAuthHeaders,
  ApiError,
  LotSearchResult,
  SearchLocationResponse,
} from '../config/apiConfig';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LotSearchRouteProp = RouteProp<
  RootStackParamList,
  'LotSearchResultsScreen'
>;

const SEARCH_DEBOUNCE_MS = 400;
const MIN_SEARCH_LENGTH = 2;

// -----------------------------------------------------------------------
// Add this route to your RootStackParamList in MainApp.tsx so navigation
// and the params below type-check:
//
//   LotSearchResultsScreen: { initialQuery?: string } | undefined;
//   LotHistoryScreen: { lotNo: string | number; companyId: string | number };
//
// And register the screens, e.g.:
//   <Stack.Screen name="LotSearchResultsScreen" component={LotSearchResultsScreen} />
//   <Stack.Screen name="LotHistoryScreen" component={LotHistoryScreen} />
// -----------------------------------------------------------------------

// One label/value block inside the expanded panel — label small and
// uppercase on top, value bigger and bold underneath. Laid out two per
// row in a grid so the panel stays compact.
const DetailItem: React.FC<{
  label: string;
  value: string | number;
  accent?: boolean;
}> = ({ label, value, accent }) => (
  <View style={itemStyles.item}>
    <Text style={itemStyles.label} numberOfLines={1}>
      {label}
    </Text>
    <Text
      style={[itemStyles.value, accent && itemStyles.valueAccent]}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

const itemStyles = StyleSheet.create({
  item: {
    width: '48%',
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  valueAccent: {
    color: COLORS.success,
  },
});

const LotSearchResultsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LotSearchRouteProp>();
  const initialQuery = route.params?.initialQuery ?? '';
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<LotSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [expandedLot, setExpandedLot] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<string | number | undefined>(
    undefined,
  );
  const [customerId, setCustomerId] = useState<string | number | undefined>(
    undefined,
  );
  // Unit selected on CompanySelectionScreen (e.g. "D-514"). Lot search is
  // scoped to this unit so only that unit's lots come back.
  const [unitId, setUnitId] = useState<string | number | undefined>(undefined);
  const [unitName, setUnitName] = useState<string | undefined>(undefined);

  // ---- Reliable auto-focus: open the keyboard the instant this screen
  // finishes its push transition, so the user only taps once (on the
  // Home search bar) and can start typing immediately here. ----
  useEffect(() => {
    const unsubscribe = navigation.addListener('transitionEnd', () => {
      inputRef.current?.focus();
    });
    const fallbackTimer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [navigation]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getUserData();
        setCompanyId(storedUser?.selectedCompany?.CompanyId);
        setCustomerId(storedUser?.CustomerId);
        setUnitId(storedUser?.selectedUnit?.UnitId);
        setUnitName(storedUser?.selectedUnit?.UnitName);
      } catch (err) {
        console.error('[LotSearchResultsScreen] Error reading user data:', err);
      }
    };
    loadUser();

    if (initialQuery.trim().length >= MIN_SEARCH_LENGTH) {
      runLotSearch(initialQuery.trim());
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runLotSearch = async (lotNo: string) => {
    let effectiveCompanyId = companyId;
    let effectiveUnitId = unitId;
    let effectiveUnitName = unitName;

    if (!effectiveCompanyId) {
      try {
        const storedUser = await getUserData();
        if (storedUser?.selectedCompany?.CompanyId) {
          effectiveCompanyId = storedUser.selectedCompany.CompanyId;
          setCompanyId(effectiveCompanyId);
          effectiveUnitId = storedUser?.selectedUnit?.UnitId;
          effectiveUnitName = storedUser?.selectedUnit?.UnitName;
          setUnitId(effectiveUnitId);
          setUnitName(effectiveUnitName);
        } else {
          setSearchError('Please select a company first.');
          setSearchResults([]);
          setHasSearched(true);
          return;
        }
      } catch {
        setSearchError('Please select a company first.');
        setSearchResults([]);
        setHasSearched(true);
        return;
      }
    }

    setIsSearching(true);
    setSearchError('');

    try {
      let token: string | undefined;
      try {
        token = (await getToken()) || undefined;
      } catch {
        token = undefined;
      }
      const headers = await getAuthHeaders(token);

      const params = new URLSearchParams({
        lotNo,
        companyId: String(effectiveCompanyId),
        page: '1',
        pageSize: '20',
      });
      if (customerId) {
        params.append('customerId', String(customerId));
      }
      // Scope the search to the unit selected on CompanySelectionScreen
      // (e.g. D-514) so only that unit's lots are returned.
      if (effectiveUnitId) {
        params.append('unitId', String(effectiveUnitId));
      }

      const url = `${API_ENDPOINTS.SEARCH_LOCATION}?${params.toString()}`;
      const res = await fetch(url, { method: 'GET', headers });
      const rawText = await res.text();

      let data: SearchLocationResponse;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw {
          message:
            res.status === 401 || res.status === 403
              ? 'Not authorized. Please log in again.'
              : `Server returned an unexpected response (status ${res.status}).`,
          status: res.status,
        } as ApiError;
      }

      if (!res.ok || !data.success) {
        throw {
          message:
            (data as any)?.message || 'No results found for this lot number.',
          status: res.status,
        } as ApiError;
      }

      let results = data.data || [];

      // Client-side safety net: if the backend ever returns locations
      // spanning multiple units, keep only the ones matching the
      // selected unit's name so the list displayed always matches what
      // the user picked on CompanySelectionScreen.
      if (effectiveUnitName) {
        results = results
          .map(lot => ({
            ...lot,
            locations: lot.locations.filter(
              loc => loc.unitName === effectiveUnitName,
            ),
          }))
          .filter(lot => lot.locations.length > 0);
      }

      setSearchResults(results);
      setSearchCount(data.count ?? results.length);
      setHasSearched(true);
    } catch (error) {
      const apiError = error as ApiError;
      console.error('[LotSearchResultsScreen] runLotSearch error:', apiError);
      setSearchResults([]);
      setSearchError(apiError.message || 'Failed to search location.');
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setExpandedLot(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = text.trim();
    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setHasSearched(false);
      setSearchResults([]);
      setSearchError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      runLotSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSearchSubmit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = searchQuery.trim();
    if (trimmed.length >= MIN_SEARCH_LENGTH) {
      runLotSearch(trimmed);
    }
  };

  const clearSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchQuery('');
    setSearchResults([]);
    setSearchError('');
    setHasSearched(false);
    setExpandedLot(null);
    inputRef.current?.focus();
  };

  const toggleExpandLot = (lotNo: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLot(prev => (prev === lotNo ? null : lotNo));
  };

  // Jumps straight to the history screen for this lot — does not require
  // the card to be expanded first, and doesn't toggle expand state
  // because it's a sibling TouchableOpacity, not nested in the toggle one.
  const goToLotHistory = (lotNo: number) => {
    if (!companyId) return;
    navigation.navigate('LotHistoryScreen', { lotNo, companyId });
  };

  const renderLot = ({ item }: { item: LotSearchResult }) => {
    const isExpanded = expandedLot === item.lotNo;
    const multipleLocations = item.locations.length > 1;

    return (
      <View style={styles.card}>
        {/* Collapsed row: lot number + item name on the left, expand
            arrow pinned to the top-right corner. Tapping anywhere in
            this row toggles the panel below. History is reached from
            inside the expanded panel, not from this row. */}
        <TouchableOpacity
          style={styles.cardTop}
          onPress={() => toggleExpandLot(item.lotNo)}
          activeOpacity={0.7}
        >
          <View style={styles.cardTopContent}>
            <View style={styles.lotBadge}>
              <Text style={styles.lotBadgeText} numberOfLines={1}>
                LOT {item.lotNo}
              </Text>
            </View>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.itemName}
            </Text>
          </View>

          <Text style={styles.expandArrow}>{isExpanded ? '⌃' : '›'}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedPanel}>
            {/* Overall totals — only visible once expanded */}
            <View style={styles.detailGrid}>
              <DetailItem
                label="Total Available"
                value={item.totalAvailableQty}
                accent
              />
              <DetailItem label="Total Boxes" value={item.totalBoxes} />
            </View>

            {item.locations.map((loc, i) => {
              const isFirst = i === 0;
              return (
                <View
                  key={`${item.lotNo}-${i}`}
                  style={[
                    styles.locationBlock,
                    multipleLocations &&
                      !isFirst &&
                      styles.locationBlockDivider,
                  ]}
                >
                  {multipleLocations && (
                    <Text style={styles.locationBlockTitle}>
                      Location {i + 1} of {item.locations.length}
                    </Text>
                  )}

                  <View style={styles.detailGrid}>
                    <DetailItem label="Location" value={loc.locationName} />
                    <DetailItem
                      label="Sub-location"
                      value={loc.subLocationName}
                    />
                    <DetailItem label="Unit" value={loc.unitName} />
                    {/* Available / Boxes only shown per-location when a lot
                        spans more than one location — otherwise they'd just
                        repeat the totals already shown above. */}
                    {multipleLocations && (
                      <>
                        <DetailItem
                          label="Available"
                          value={loc.availableQty}
                          accent
                        />
                        <DetailItem label="Boxes" value={loc.totalBoxes} />
                      </>
                    )}
                  </View>
                </View>
              );
            })}

            {/* Secondary entry point to history, visible once expanded too,
                for anyone who reads the details first before wanting history. */}
            <TouchableOpacity
              style={styles.viewHistoryLink}
              onPress={() => goToLotHistory(item.lotNo)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewHistoryLinkText}>
                View movement history →
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderBody = () => {
    if (isSearching) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.centerStateText}>Searching...</Text>
        </View>
      );
    }

    if (searchError) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.centerStateTitle}>Something went wrong</Text>
          <Text style={styles.centerStateText}>{searchError}</Text>
        </View>
      );
    }

    if (hasSearched && searchResults.length === 0) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.centerStateTitle}>No lots found</Text>
          <Text style={styles.centerStateText}>
            Nothing matched "{searchQuery}"{unitName ? ` in ${unitName}` : ''}.
            Try a different lot number.
          </Text>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.centerStateTitle}>Search by Lot No.</Text>
          <Text style={styles.centerStateText}>
            Enter at least {MIN_SEARCH_LENGTH} digits to find a lot's locations
            and available quantity{unitName ? ` in ${unitName}` : ''}.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={item => String(item.lotNo)}
        renderItem={renderLot}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <Text style={styles.resultsHeaderText}>
            {searchCount} LOT{searchCount !== 1 ? 'S' : ''} FOUND
            {unitName ? ` · ${unitName.toUpperCase()}` : ''}
          </Text>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            Search Lot{unitName ? ` · ${unitName}` : ''}
          </Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.searchSection}>
          <View
            style={[styles.searchBar, isFocused && styles.searchBarFocused]}
          >
            <Text
              style={[styles.searchIcon, isFocused && styles.searchIconFocused]}
            >
              ⌕
            </Text>
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Enter Lot No."
              placeholderTextColor={COLORS.faint}
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search"
              keyboardType="number-pad"
              autoCorrect={false}
            />
            {isSearching && (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={{ marginRight: 6 }}
              />
            )}
            {searchQuery.length > 0 && !isSearching && (
              <TouchableOpacity
                onPress={clearSearch}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.body}>{renderBody()}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
    minHeight: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 30,
    color: COLORS.ink,
    fontWeight: '400',
  },
  topBarTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.ink,
    textAlign: 'center',
  },

  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  searchBarFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
    color: COLORS.subtle,
    fontWeight: '700',
  },
  searchIconFocused: {
    color: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ink,
    paddingVertical: 0,
  },
  clearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e3e6ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: COLORS.subtle,
    fontWeight: '700',
  },

  body: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  resultsHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.faint,
    letterSpacing: 0.6,
    paddingTop: 16,
    paddingBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Empty / error / idle states
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: COLORS.bg,
  },
  centerStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 6,
    textAlign: 'center',
  },
  centerStateText: {
    fontSize: 13.5,
    color: COLORS.subtle,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#0a0e14',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },

  // Collapsed row: lot badge + item name on the left, expand arrow
  // pinned to the right. Whole row is tappable to expand.
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
  },
  cardTopContent: {
    flex: 1,
    marginRight: 10,
  },

  // Lot number — highlighted in primary blue, sits above the item name
  lotBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
  },
  lotBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },

  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    lineHeight: 20,
  },

  expandArrow: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },

  // Expanded panel — everything (totals + per-location detail grids)
  // lives here and only renders once the card is tapped open
  expandedPanel: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },

  // Label-above / value-below grid, two items per row
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  locationBlock: {
    paddingBottom: 2,
  },
  locationBlockDivider: {
    borderTopWidth: 1,
    borderTopColor: '#e5e8ec',
    paddingTop: 12,
    marginTop: 2,
  },
  locationBlockTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Secondary "View movement history" link at the bottom of the expanded panel
  viewHistoryLink: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 10,
  },
  viewHistoryLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

export default LotSearchResultsScreen;
