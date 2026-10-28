import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './MainApp';
import { getToken } from '../utils/storage';
import { COLORS, getStatusColor } from '../theme/colors';
import {
  API_ENDPOINTS,
  getAuthHeaders,
  ApiError,
  LotHistoryResponse,
  LotCurrentLocation,
  LotMovementHistoryItem,
} from '../config/apiConfig';

// -----------------------------------------------------------------------
// Add this route to RootStackParamList in MainApp.tsx:
//   LotHistoryScreen: { lotNo: string | number; companyId: string | number };
// And register it:
//   <Stack.Screen name="LotHistoryScreen" component={LotHistoryScreen} />
// -----------------------------------------------------------------------

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LotHistoryRouteProp = RouteProp<RootStackParamList, 'LotHistoryScreen'>;

const formatDate = (value: string) => {
  if (!value) return '—';
  const d = new Date(value.includes(' ') ? value.replace(' ', 'T') : value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (value: string) => {
  if (!value) return '—';
  const d = new Date(value.includes(' ') ? value.replace(' ', 'T') : value);
  if (isNaN(d.getTime())) return value;
  const datePart = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} · ${timePart}`;
};

// Small label-above/value-below block, reused for both the summary
// card and each current-location card.
const Stat: React.FC<{
  label: string;
  value: string | number;
  accent?: boolean;
}> = ({ label, value, accent }) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel} numberOfLines={1}>
      {label}
    </Text>
    <Text
      style={[styles.statValue, accent && styles.statValueAccent]}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

// One row inside the metadata list — label on the left (subtle, small),
// value on the right (bold, ink). Reads top-to-bottom instead of
// wrapping into a cramped 2-column grid.
const MetaRow: React.FC<{
  label: string;
  value: string | number;
  warn?: boolean;
  last?: boolean;
}> = ({ label, value, warn, last }) => (
  <View style={[styles.metaRow, !last && styles.metaRowDivider]}>
    <Text style={styles.metaRowLabel}>{label}</Text>
    <Text style={[styles.metaRowValue, warn && styles.metaRowValueWarn]}>
      {value}
    </Text>
  </View>
);

const CurrentLocationCard: React.FC<{ loc: LotCurrentLocation }> = ({
  loc,
}) => (
  <View style={styles.locCard}>
    {/* Header: location name is the headline, sub-location/unit ride
        underneath it as context, type sits as a pill on the right */}
    <View style={styles.locCardHeader}>
      <View style={styles.locHeaderText}>
        <Text style={styles.locName} numberOfLines={1}>
          {loc.LOCATION_NAME}
        </Text>
        <Text style={styles.locSubName} numberOfLines={1}>
          {loc.SUB_LOCATION_NAME} · {loc.UNIT_NAME}
        </Text>
      </View>
      <View style={styles.locTypeBadge}>
        <Text style={styles.locTypeBadgeText}>{loc.LOCATION_TYPE}</Text>
      </View>
    </View>

    {/* Hero stats — the two numbers people actually scan for */}
    <View style={styles.locHeroRow}>
      <View style={styles.locHeroStat}>
        <Text style={[styles.locHeroValue, styles.locHeroValueAccent]}>
          {loc.AVAILABLE_QTY}
        </Text>
        <Text style={styles.locHeroLabel}>Available</Text>
      </View>
      <View style={styles.locHeroDivider} />
      <View style={styles.locHeroStat}>
        <Text style={styles.locHeroValue}>{loc.TOTAL_BOXES}</Text>
        <Text style={styles.locHeroLabel}>Boxes</Text>
      </View>
    </View>

    {/* Secondary metadata — one fact per row, plenty of room for dates */}
    <View style={styles.metaList}>
      <MetaRow label="Placed On" value={formatDate(loc.PLACED_ON)} />
      <MetaRow label="Last Billing" value={formatDate(loc.LAST_BILLING_DATE)} />
      <MetaRow
        label="Next Schedule"
        value={formatDate(loc.NEXT_SCHEDULE_DATE)}
      />
      <MetaRow
        label="Multiple Owner"
        value={loc.MULTIPLE_OWNER}
        warn={loc.MULTIPLE_OWNER === 'YES'}
        last
      />
    </View>
  </View>
);

// One row of the movement timeline: a dot+line rail on the left,
// old → new location and metadata on the right.
const MovementRow: React.FC<{
  item: LotMovementHistoryItem;
  isLast: boolean;
}> = ({ item, isLast }) => {
  const statusColor = getStatusColor(item.STATUS);

  return (
    <View style={styles.moveRow}>
      <View style={styles.railColumn}>
        <View style={[styles.railDot, { backgroundColor: statusColor }]} />
        {!isLast && <View style={styles.railLine} />}
      </View>

      <View style={styles.moveContent}>
        <View style={styles.moveTopRow}>
          <Text style={styles.moveDate}>{formatDateTime(item.MOVED_ON)}</Text>
          <View style={styles.qtyChip}>
            <Text style={styles.qtyChipText}>{item.MOVED_QTY} qty</Text>
          </View>
        </View>

        <View style={styles.moveLocationRow}>
          <Text style={styles.moveLocationText} numberOfLines={1}>
            {item.OLD_LOCATION}
          </Text>
          <Text style={styles.moveArrow}>→</Text>
          <Text
            style={[styles.moveLocationText, styles.moveLocationNew]}
            numberOfLines={1}
          >
            {item.NEW_LOCATION}
          </Text>
        </View>

        <View style={styles.moveMetaRow}>
          <Text style={styles.moveMetaText}>By {item.CREATEDBY}</Text>
          {item.BOX_NO != null && (
            <Text style={styles.moveMetaText}>· Box {item.BOX_NO}</Text>
          )}
          <View
            style={[styles.statusPill, { backgroundColor: `${statusColor}1a` }]}
          >
            <Text style={[styles.statusPillText, { color: statusColor }]}>
              {item.STATUS}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const LotHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LotHistoryRouteProp>();
  const { lotNo, companyId } = route.params;

  const [data, setData] = useState<LotHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      try {
        let token: string | undefined;
        try {
          token = (await getToken()) || undefined;
        } catch {
          token = undefined;
        }
        const headers = await getAuthHeaders(token);
        const url = API_ENDPOINTS.LOT_HISTORY(lotNo, companyId);

        const res = await fetch(url, { method: 'GET', headers });
        const rawText = await res.text();

        let json: LotHistoryResponse;
        try {
          json = JSON.parse(rawText);
        } catch {
          throw {
            message:
              res.status === 401 || res.status === 403
                ? 'Not authorized. Please log in again.'
                : `Server returned an unexpected response (status ${res.status}).`,
            status: res.status,
          } as ApiError;
        }

        if (!res.ok || !json.success) {
          throw {
            message: json.message || 'Failed to load lot history.',
            status: res.status,
          } as ApiError;
        }

        setData(json);
      } catch (err) {
        const apiError = err as ApiError;
        console.error('[LotHistoryScreen] loadHistory error:', apiError);
        setError(apiError.message || 'Failed to load lot history.');
        setData(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [lotNo, companyId],
  );

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.centerStateText}>Loading history...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerState}>
          <Text style={styles.centerStateTitle}>Something went wrong</Text>
          <Text style={styles.centerStateText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadHistory()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!data) return null;

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadHistory(true)}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.lotBadge}>
            <Text style={styles.lotBadgeText}>LOT {data.lotNo}</Text>
          </View>

          <View style={styles.summaryStatsRow}>
            <Stat
              label="Total Available"
              value={data.totalAvailableQty}
              accent
            />
            <Stat label="Total Boxes" value={data.totalBoxes} />
            <Stat label="Locations" value={data.locationCount} />
          </View>
        </View>

        {/* Current locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location(s)</Text>
          {data.currentLocations.map(loc => (
            <CurrentLocationCard key={loc.STOCK_LOT_LOC_ID} loc={loc} />
          ))}
        </View>

        {/* Movement history timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Movement History</Text>

          {data.movementHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.centerStateText}>
                No movement records for this lot yet.
              </Text>
            </View>
          ) : (
            <View style={styles.timelineCard}>
              {data.movementHistory.map((item, idx) => (
                <MovementRow
                  key={item.ID}
                  item={item}
                  isLast={idx === data.movementHistory.length - 1}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Lot History
        </Text>
        <View style={styles.backButton} />
      </View>

      {renderBody()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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

  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: 16,
  },

  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
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
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },

  // Summary card
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
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
  summaryStatsRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Shared stat block
  stat: {
    marginBottom: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
  },
  statValueAccent: {
    color: COLORS.success,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.ink,
    marginBottom: 10,
  },

  // Current location card — three tiers: header, hero stats, meta list
  locCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 8,
  },

  // Tier 1: location name + sub-location/unit subtitle, type pill on right
  locCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locHeaderText: {
    flex: 1,
    marginRight: 8,
  },
  locName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 2,
  },
  locSubName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.subtle,
  },
  locTypeBadge: {
    backgroundColor: COLORS.bg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  locTypeBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: COLORS.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Tier 2: the two numbers people actually scan for, pulled out big
  locHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    paddingVertical: 9,
    marginBottom: 8,
  },
  locHeroStat: {
    flex: 1,
    alignItems: 'center',
  },
  locHeroDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  locHeroValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.ink,
    marginBottom: 1,
  },
  locHeroValueAccent: {
    color: COLORS.success,
  },
  locHeroLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Tier 3: one fact per row, plenty of room for full dates
  metaList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  metaRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f4',
  },
  metaRowLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.subtle,
  },
  metaRowValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.ink,
  },
  metaRowValueWarn: {
    color: COLORS.danger,
  },

  emptyHistory: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  // Timeline
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 4,
  },
  moveRow: {
    flexDirection: 'row',
  },
  railColumn: {
    width: 18,
    alignItems: 'center',
  },
  railDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.subtle, // overridden per-row via getStatusColor
    marginTop: 3,
  },
  railLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginTop: 2,
    marginBottom: 2,
  },
  moveContent: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 18,
  },
  moveTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  moveDate: {
    fontSize: 11.5,
    fontWeight: '600',
    color: COLORS.subtle,
  },
  qtyChip: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  qtyChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  moveLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  moveLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.subtle,
    maxWidth: '42%',
  },
  moveLocationNew: {
    color: COLORS.ink,
    fontWeight: '700',
  },
  moveArrow: {
    fontSize: 14,
    color: COLORS.faint,
    marginHorizontal: 6,
  },
  moveMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveMetaText: {
    fontSize: 11.5,
    color: COLORS.faint,
    fontWeight: '500',
    marginRight: 6,
  },
  statusPill: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default LotHistoryScreen;
