// src/screens/OutstandingReportScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 56;

const API_BASE = 'http://202.189.234.140:5000/sf/hsnlocal';

interface ApiCustomer {
  FK_CUSTOMER_ID: number;
  DISP_NAME: string;
  FK_UNIT_ID: number;
  UNIT_NAME: string;
}

interface CustomerGroup {
  id: number;
  name: string;
  units: string[];
}

interface ApiCustomerInGroup {
  custLoginId: number;
  customerId: number;
  dispName: string;
  userName: string;
  customerStatus: string;
  allowMobileApp: string;
  email: string | null;
  mobileNo: string | null;
  unitId: number;
  unitName: string;
}

interface CustomerGroupFromApi {
  custGrpId: number;
  custGrpCode: string;
  custGrpName: string;
  groupStatus: string;
  customers: ApiCustomerInGroup[];
}

interface GroupOption {
  id: number;
  code: string;
  name: string;
  customers: CustomerGroup[];
}

interface ReportSummary {
  totalInvoiceItemAmount: string;
  totalTaxAmount: string;
  totalInvoiceAmount: string;
  totalRoundoffAmount: string;
  totalOutstandingAmount: string;
  outstandingInvoices: number;
}

interface ReportResponse {
  success: boolean;
  totalRecords?: number;
  requestData?: any;
  summary: ReportSummary;
  headers: string[];
  reportData: (string | number)[][];
  message?: string;
}

const COLUMN_WIDTHS: Record<number, number> = {
  0: 70,
  1: 180,
  2: 160,
  3: 220,
  4: 220,
  5: 120,
  6: 130,
  7: 130,
  8: 150,
  9: 130,
  10: 180,
  11: 160,
};

const OutstandingReportScreen = () => {
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupOption | null>(null);

  const [customers, setCustomers] = useState<CustomerGroup[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerGroup | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  const [fromDate, setFromDate] = useState(new Date(2025, 11, 1));
  const [toDate, setToDate] = useState(new Date());

  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fixedRef = useRef<FlatList>(null);
  const scrollableRef = useRef<FlatList>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  // ────────────────────────────────────────────────
  // Load groups & customers
  // ────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoadingCustomers(true);
      try {
        const resp = await fetch(`${API_BASE}/allCustomersWithGroups`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const json = await resp.json();
        if (!json.success || !Array.isArray(json.data)) {
          throw new Error('Invalid response format');
        }

        const transformed: GroupOption[] = json.data
          .filter(
            (g: CustomerGroupFromApi) =>
              g.groupStatus?.toUpperCase() === 'ACTIVE',
          )
          .map((g: CustomerGroupFromApi) => {
            const customerMap = new Map<number, CustomerGroup>();

            g.customers.forEach((c: ApiCustomerInGroup) => {
              if (!customerMap.has(c.customerId)) {
                customerMap.set(c.customerId, {
                  id: c.customerId,
                  name: c.dispName,
                  units: [],
                });
              }
              customerMap.get(c.customerId)!.units.push(c.unitName);
            });

            return {
              id: g.custGrpId,
              code: g.custGrpCode,
              name: g.custGrpName,
              customers: Array.from(customerMap.values()),
            };
          });

        setGroups(transformed);

        // Also set all customers for "All Groups" case
        const allCustomers = transformed.flatMap(g => g.customers);
        setCustomers(allCustomers);
      } catch (err: any) {
        console.error('Data load failed:', err);
        Alert.alert('Error', 'Failed to load customer groups');
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadData();
  }, []);

  const generateReport = async () => {
    console.log('Generate Report → started');

    setLoadingReport(true);
    setReport(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const payload: any = {
        fromDate: format(fromDate, 'dd/MM/yyyy'),
        toDate: format(toDate, 'dd/MM/yyyy'),
      };

      // ────────────── Key part you're interested in ──────────────
      if (selectedGroup) {
        payload.customerGroupName = selectedGroup.name;
        console.log('→ Including customerGroupName:', selectedGroup.name);
      } else {
        console.log('→ No customerGroupName (All Groups selected)');
      }

      if (selectedCustomer) {
        payload.customerName = selectedCustomer.name;
        console.log('→ Including customerName:', selectedCustomer.name);

        if (selectedUnits.length > 0) {
          payload.unit = selectedUnits;
          console.log('→ Including specific units:', selectedUnits);
        } else {
          console.log(
            '→ No units → backend should return all units of this customer',
          );
        }
      }

      const resp = await fetch(`${API_BASE}/outstandingReport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      // ─── Get raw body BEFORE trying to parse JSON ───
      const rawBody = await resp.text();

      if (!resp.ok) {
        console.log('HTTP ERROR → throwing');
        throw new Error(
          `Server returned ${resp.status} – ${rawBody.substring(0, 300)}`,
        );
      }

      let data: ReportResponse;
      try {
        data = JSON.parse(rawBody);
      } catch (parseErr) {
        console.log('JSON PARSE FAILED – server did NOT return valid JSON');
        console.log(parseErr);
        throw new Error('Response is not valid JSON');
      }

      if (!data.success) {
        console.log('Backend success = false →', data.message || 'No message');
      }

      setReport(data);
      setCurrentPage(1);
    } catch (err: any) {
      console.error('generateReport failed:', err);
      if (err.name === 'AbortError') {
        Alert.alert('Timeout', 'Request timed out after 60 seconds');
      } else {
        Alert.alert('Error', err.message || 'Failed to fetch report');
      }
    } finally {
      setLoadingReport(false);
      console.log('Generate Report → finished');
    }
  };

  const formatINR = (value: string | number | undefined): string => {
    if (value == null) return '—';
    const num =
      typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
    if (isNaN(num)) return '—';
    return `₹${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const todayStr = format(new Date(), 'dd MMM yyyy');

  const getUnitsDisplayText = (): string => {
    if (!selectedCustomer) return 'Select customer first...';
    if (selectedUnits.length === 0) return 'All units';
    return selectedUnits.join(', ');
  };

  const availableCustomers = selectedGroup
    ? selectedGroup.customers
    : customers;

  const filteredCustomers = availableCustomers.filter(cust =>
    cust.name.toLowerCase().includes(customerSearchQuery.toLowerCase()),
  );

  const filteredGroups = groups.filter(
    g =>
      g.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      g.code.toLowerCase().includes(groupSearchQuery.toLowerCase()),
  );

  const handleFixedScroll = (event: any) => {
    if (!isSyncing) {
      setIsSyncing(true);
      scrollableRef.current?.scrollToOffset({
        offset: event.nativeEvent.contentOffset.y,
        animated: false,
      });
      setIsSyncing(false);
    }
  };

  const handleScrollableScroll = (event: any) => {
    if (!isSyncing) {
      setIsSyncing(true);
      fixedRef.current?.scrollToOffset({
        offset: event.nativeEvent.contentOffset.y,
        animated: false,
      });
      setIsSyncing(false);
    }
  };

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Outstanding Report</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          {/* Group Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Group</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setGroupModalVisible(true)}
              disabled={loadingCustomers || loadingReport}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedGroup && styles.placeholderText,
                ]}
              >
                {selectedGroup ? selectedGroup.name : 'All Groups'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Customer Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setCustomerModalVisible(true)}
              disabled={loadingCustomers || loadingReport}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedCustomer && styles.placeholderText,
                ]}
              >
                {selectedCustomer?.name || 'All Customers'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Unit Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unit(s)</Text>
            <TouchableOpacity
              style={[
                styles.dropdown,
                !selectedCustomer && styles.dropdownDisabled,
              ]}
              onPress={() => selectedCustomer && setUnitModalVisible(true)}
              disabled={!selectedCustomer || loadingReport}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedCustomer && styles.placeholderText,
                  selectedCustomer &&
                    selectedUnits.length === 0 &&
                    styles.normalText,
                ]}
              >
                {getUnitsDisplayText()}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Dates */}
          <View style={styles.dateRow}>
            <View style={styles.dateHalf}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowFromModal(true)}
                disabled={loadingReport}
              >
                <Text style={styles.dateText}>
                  {format(fromDate, 'dd/MM/yyyy')} 📅
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateHalf}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowToModal(true)}
                disabled={loadingReport}
              >
                <Text style={styles.dateText}>
                  {format(toDate, 'dd/MM/yyyy')} 📅
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.generateBtn, loadingReport && styles.btnDisabled]}
            onPress={generateReport}
            disabled={loadingReport}
          >
            {loadingReport ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnText}>Generate Report</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Summary & Table sections */}
        {report && (
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.sumLabel}>Total Outstanding</Text>
                <Text style={styles.sumValue}>
                  {formatINR(report.summary.totalOutstandingAmount)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.sumLabel}># Invoices</Text>
                <Text style={styles.sumValue}>
                  {report.summary.outstandingInvoices}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.sumLabel}>Invoice Amount</Text>
                <Text style={styles.sumValue}>
                  {formatINR(report.summary.totalInvoiceAmount)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.sumLabel}>Tax Amount</Text>
                <Text style={styles.sumValue}>
                  {formatINR(report.summary.totalTaxAmount)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {report?.reportData && report.reportData.length > 0 && (
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <Text style={{ marginBottom: 12, color: '#555', fontSize: 14 }}>
              Showing {report.reportData.length} outstanding invoices
            </Text>

            <View style={styles.tableWrapper}>
              {/* Fixed Column */}
              <View style={styles.fixedColumn}>
                <FlatList
                  ref={fixedRef}
                  data={report.reportData.slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage,
                  )}
                  keyExtractor={(_, i) => `fixed-${i}`}
                  renderItem={({ item: row, index }) => (
                    <View
                      style={[
                        styles.tableRow,
                        index % 2 === 1 && styles.zebraRow,
                      ]}
                    >
                      <View
                        style={[
                          styles.cellWrapper,
                          { width: COLUMN_WIDTHS[0] },
                        ]}
                      >
                        <Text style={[styles.cell, styles.srNoCell]}>
                          {String(row[0] ?? '—')}
                        </Text>
                      </View>
                    </View>
                  )}
                  ListHeaderComponent={
                    <View style={[styles.tableHeader, styles.fixedHeader]}>
                      <View
                        style={[
                          styles.headerCellWrapper,
                          { width: COLUMN_WIDTHS[0] },
                        ]}
                      >
                        <Text style={styles.headerCell}>
                          {report.headers[0]}
                        </Text>
                      </View>
                    </View>
                  }
                  stickyHeaderIndices={[0]}
                  onScroll={handleFixedScroll}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              {/* Scrollable Part */}
              <ScrollView horizontal style={styles.scrollablePart}>
                <FlatList
                  ref={scrollableRef}
                  data={report.reportData.slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage,
                  )}
                  keyExtractor={(_, i) => `scroll-${i}`}
                  renderItem={({ item: row, index }) => (
                    <View
                      style={[
                        styles.tableRow,
                        index % 2 === 1 && styles.zebraRow,
                      ]}
                    >
                      {row.slice(1).map((cell, colIndex) => {
                        const globalIndex = colIndex + 1;
                        const isAmount = globalIndex >= 6;
                        return (
                          <View
                            key={colIndex}
                            style={[
                              styles.cellWrapper,
                              { width: COLUMN_WIDTHS[globalIndex] || 160 },
                            ]}
                          >
                            <Text
                              style={[
                                styles.cell,
                                isAmount && styles.amountCell,
                              ]}
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {cell == null || cell === '' ? '—' : String(cell)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                  ListHeaderComponent={
                    <View style={styles.tableHeader}>
                      {report.headers.slice(1).map((h, i) => (
                        <View
                          key={i}
                          style={[
                            styles.headerCellWrapper,
                            { width: COLUMN_WIDTHS[i + 1] || 160 },
                          ]}
                        >
                          <Text style={styles.headerCell}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  }
                  stickyHeaderIndices={[0]}
                  onScroll={handleScrollableScroll}
                  scrollEventThrottle={16}
                />
              </ScrollView>
            </View>

            {report.reportData.length > rowsPerPage && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.pageButtonDisabled,
                  ]}
                  onPress={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.pageButtonText}>Previous</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfo}>
                  Page {currentPage} of{' '}
                  {Math.ceil(report.reportData.length / rowsPerPage)}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage >=
                      Math.ceil(report.reportData.length / rowsPerPage) &&
                      styles.pageButtonDisabled,
                  ]}
                  onPress={() =>
                    setCurrentPage(p =>
                      Math.min(
                        p + 1,
                        Math.ceil(report.reportData.length / rowsPerPage),
                      ),
                    )
                  }
                  disabled={
                    currentPage >=
                    Math.ceil(report.reportData.length / rowsPerPage)
                  }
                >
                  <Text style={styles.pageButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {report && (!report.reportData || report.reportData.length === 0) && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No outstanding invoices found.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ─── Group Modal ─── */}
      <Modal
        visible={groupModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Customer Group</Text>
              <TouchableOpacity onPress={() => setGroupModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search groups..."
              value={groupSearchQuery}
              onChangeText={setGroupSearchQuery}
            />

            <ScrollView style={styles.modalScrollView}>
              <TouchableOpacity
                style={[
                  styles.modalRow,
                  !selectedGroup && styles.modalRowSelected,
                ]}
                onPress={() => {
                  setSelectedGroup(null);
                  setSelectedCustomer(null);
                  setSelectedUnits([]);
                  setGroupModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>All Groups</Text>
                {!selectedGroup && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>

              {filteredGroups.map(group => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.modalRow,
                    selectedGroup?.id === group.id && styles.modalRowSelected,
                  ]}
                  onPress={() => {
                    setSelectedGroup(group);
                    setSelectedCustomer(null);
                    setSelectedUnits([]);
                    setGroupModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>
                    {group.name} ({group.code})
                  </Text>
                  {selectedGroup?.id === group.id && (
                    <Text style={styles.check}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── Customer Modal ─── */}
      <Modal
        visible={customerModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCustomerModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGroup
                  ? `Customers in ${selectedGroup.name}`
                  : 'Select Customer'}
              </Text>
              <TouchableOpacity onPress={() => setCustomerModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search customers..."
              value={customerSearchQuery}
              onChangeText={setCustomerSearchQuery}
            />

            <ScrollView style={styles.modalScrollView}>
              <TouchableOpacity
                style={[
                  styles.modalRow,
                  !selectedCustomer && styles.modalRowSelected,
                ]}
                onPress={() => {
                  setSelectedCustomer(null);
                  setSelectedUnits([]);
                  setCustomerModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>All Customers</Text>
                {!selectedCustomer && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>

              {filteredCustomers.map(cust => (
                <TouchableOpacity
                  key={cust.id}
                  style={[
                    styles.modalRow,
                    selectedCustomer?.id === cust.id && styles.modalRowSelected,
                  ]}
                  onPress={() => {
                    setSelectedCustomer(cust);
                    setSelectedUnits([]);
                    setCustomerModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{cust.name}</Text>
                  {selectedCustomer?.id === cust.id && (
                    <Text style={styles.check}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── Unit Modal ─── */}
      <Modal
        visible={unitModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setUnitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Unit(s)</Text>
              <TouchableOpacity onPress={() => setUnitModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <TouchableOpacity
                style={[
                  styles.modalRow,
                  selectedUnits.length === 0 && styles.modalRowSelected,
                ]}
                onPress={() => {
                  setSelectedUnits([]);
                  setUnitModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>All Units</Text>
                {selectedUnits.length === 0 && (
                  <Text style={styles.check}>✓</Text>
                )}
              </TouchableOpacity>

              {selectedCustomer?.units.map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.modalRow,
                    selectedUnits.includes(unit) && styles.modalRowSelected,
                  ]}
                  onPress={() => {
                    setSelectedUnits(prev =>
                      prev.includes(unit)
                        ? prev.filter(u => u !== unit)
                        : [...prev, unit],
                    );
                  }}
                >
                  <Text style={styles.modalText}>{unit}</Text>
                  {selectedUnits.includes(unit) && (
                    <Text style={styles.check}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setUnitModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Modals (From & To) – unchanged */}
      <Modal
        visible={showFromModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFromModal(false)}
      >
        <View style={styles.dateModalOverlay}>
          <View style={styles.dateModalContainer}>
            <View style={styles.dateModalHeader}>
              <Text style={styles.dateModalTitle}>Select From Date</Text>
              <TouchableOpacity onPress={() => setShowFromModal(false)}>
                <Text style={styles.dateModalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={fromDate}
              mode="date"
              display="spinner"
              onChange={(e, date) => {
                if (e.type === 'set' && date) {
                  if (date > toDate) {
                    Alert.alert('Invalid', 'From date cannot be after To date');
                    return;
                  }
                  setFromDate(date);
                }
              }}
              maximumDate={toDate}
            />

            <TouchableOpacity
              style={styles.dateModalDoneBtn}
              onPress={() => setShowFromModal(false)}
            >
              <Text style={styles.dateModalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showToModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowToModal(false)}
      >
        <View style={styles.dateModalOverlay}>
          <View style={styles.dateModalContainer}>
            <View style={styles.dateModalHeader}>
              <Text style={styles.dateModalTitle}>Select To Date</Text>
              <TouchableOpacity onPress={() => setShowToModal(false)}>
                <Text style={styles.dateModalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={toDate}
              mode="date"
              display="spinner"
              onChange={(e, date) => {
                if (e.type === 'set' && date) {
                  if (date < fromDate) {
                    Alert.alert(
                      'Invalid',
                      'To date cannot be before From date',
                    );
                    return;
                  }
                  setToDate(date);
                }
              }}
              minimumDate={fromDate}
            />

            <TouchableOpacity
              style={styles.dateModalDoneBtn}
              onPress={() => setShowToModal(false)}
            >
              <Text style={styles.dateModalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { paddingBottom: 60 },

  header: {
    backgroundColor: '#0d6efd',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '700', color: 'white', marginTop: 5 },
  date: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 4 },

  filterContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '500' },

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
  dropdownDisabled: { backgroundColor: '#f0f0f0', opacity: 0.6 },
  dropdownText: { fontSize: 16, color: '#222', flex: 1 },
  placeholderText: { color: '#999' },
  normalText: { color: '#222' },
  dropdownIcon: { fontSize: 12, color: '#666', marginLeft: 8 },

  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  dateHalf: { flex: 1 },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  dateText: { fontSize: 16, color: '#222' },

  generateBtn: {
    backgroundColor: '#0d6efd',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { backgroundColor: '#a5c8ff' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  pageButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  pageButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  pageInfo: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  summaryContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryItem: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  sumLabel: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  sumValue: { fontSize: 16, fontWeight: '700', color: '#0d6efd' },

  tableContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  tableWrapper: {
    flexDirection: 'row',
  },
  fixedColumn: {
    // width: 60,
    backgroundColor: '#e9ecef',
    zIndex: 1,
  },
  fixedHeader: {
    borderTopLeftRadius: 8,
  },
  scrollablePart: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
  },
  headerCellWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#dee2e6',
    height: HEADER_HEIGHT,
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: '700',
    fontSize: 13.5,
    color: '#333',
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
    height: ROW_HEIGHT,
  },
  zebraRow: { backgroundColor: '#f9f9f9' },
  cellWrapper: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    padding: 10,
    paddingVertical: 0,
    minWidth: 120,
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    lineHeight: 20,
  },

  longTextCell: {
    textAlign: 'left',
    paddingLeft: 12,
    paddingRight: 8,
  },
  srNoCell: {
    fontWeight: '600',
    fontSize: 13.5,
  },

  amountCell: {
    fontWeight: '600',
    color: '#006d5b',
    textAlign: 'right',
    paddingRight: 16,
  },

  noDataContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  noDataText: { fontSize: 16, color: '#666', textAlign: 'center' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  closeButton: {
    fontSize: 24,
    color: '#666',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalScrollView: { maxHeight: 400 },
  modalRow: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalRowSelected: { backgroundColor: '#e7f3ff' },
  modalText: { fontSize: 16, color: '#222', flex: 1 },
  check: { fontSize: 20, color: '#0d6efd', fontWeight: 'bold' },
  modalBtn: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  modalBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },

  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dateModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 10,
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  dateModalClose: {
    fontSize: 16,
    color: '#0d6efd',
    fontWeight: '500',
  },
  dateModalDoneBtn: {
    backgroundColor: '#0d6efd',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  dateModalDoneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OutstandingReportScreen;
