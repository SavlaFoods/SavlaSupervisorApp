// src/screens/CollectionEntryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  onClose: () => void;
}

const CollectionEntryScreen = () => {
  // Header Fields (FIELD_COLLECT_HEADER)
  const [collectPersonName, setCollectPersonName] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [receivedOn, setReceivedOn] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [headerRemark, setHeaderRemark] = useState('');
  const [receiptNo, setReceiptNo] = useState('');

  // Detail Fields (FIELD_COLLECT_DTLS)
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [invNo, setInvNo] = useState('');
  const [invDate, setInvDate] = useState('');
  const [invAmt, setInvAmt] = useState('');
  const [outstandingAmt, setOutstandingAmt] = useState('');
  const [collectedAmt, setCollectedAmt] = useState('');
  const [receivedAmt, setReceivedAmt] = useState('');
  const [modeOfPayment, setModeOfPayment] = useState('Cash');
  const [chequeDate, setChequeDate] = useState('');
  const [refNo, setRefNo] = useState('');
  const [detailRemark, setDetailRemark] = useState('');
  const [collectType, setCollectType] = useState('Invoice');
  const [discount, setDiscount] = useState('');
  const [tds, setTds] = useState('');
  const [checkBank, setCheckBank] = useState('');
  const [chequeNo, setChequeNo] = useState('');
  const [transactionDate, setTransactionDate] = useState('');

  const navigation = useNavigation();

  const onClose = () => {
    navigation.goBack();
  };

  const paymentModes = ['Cash', 'Cheque', 'UPI', 'Bank Transfer', 'Others'];
  const collectionTypes = ['Invoice', 'Advance', 'On Account'];

  // Calculate totals
  const calculateTotals = () => {
    const collected = Number(collectedAmt) || 0;
    const discountVal = Number(discount) || 0;
    const tdsVal = Number(tds) || 0;
    const received = collected - discountVal - tdsVal;
    setReceivedAmt(received.toFixed(2));
  };

  useEffect(() => {
    calculateTotals();
  }, [collectedAmt, discount, tds]);

  const handleSubmit = () => {
    // Validation
    if (!collectPersonName.trim()) {
      Alert.alert('Required', 'Please enter collector/person name');
      return;
    }

    if (!customerName.trim()) {
      Alert.alert('Required', 'Please enter customer name');
      return;
    }

    if (!collectedAmt || Number(collectedAmt) <= 0) {
      Alert.alert('Required', 'Please enter a valid collection amount');
      return;
    }

    if (collectType === 'Invoice' && !invNo.trim()) {
      Alert.alert(
        'Required',
        'Please enter invoice number for invoice collection',
      );
      return;
    }

    if (modeOfPayment === 'Cheque') {
      if (!chequeNo.trim()) {
        Alert.alert('Required', 'Please enter cheque number');
        return;
      }
      if (!checkBank.trim()) {
        Alert.alert('Required', 'Please enter bank name');
        return;
      }
      if (!chequeDate) {
        Alert.alert('Required', 'Please enter cheque date');
        return;
      }
    }

    if (modeOfPayment === 'UPI' || modeOfPayment === 'Bank Transfer') {
      if (!refNo.trim()) {
        Alert.alert('Required', 'Please enter transaction reference number');
        return;
      }
    }

    // Prepare data for API
    const collectionData = {
      header: {
        collectPersonName,
        receivedBy,
        receivedOn,
        remark: headerRemark,
        receiptNo,
        totCollectCashAmt: modeOfPayment === 'Cash' ? Number(receivedAmt) : 0,
        totCollectChequeAmt:
          modeOfPayment === 'Cheque' ? Number(receivedAmt) : 0,
        totCollectOthersAmt:
          modeOfPayment !== 'Cash' && modeOfPayment !== 'Cheque'
            ? Number(receivedAmt)
            : 0,
        totCollectAmt: Number(receivedAmt),
      },
      details: {
        customerId,
        customerName,
        invoiceId,
        invNo,
        invDate,
        invAmt: Number(invAmt) || 0,
        outstandingAmt: Number(outstandingAmt) || 0,
        collectedAmt: Number(collectedAmt),
        receivedAmt: Number(receivedAmt),
        modeOfPayment,
        chequeDate,
        chequeNo,
        checkBank,
        refNo,
        remark: detailRemark,
        collectType,
        discount: Number(discount) || 0,
        tds: Number(tds) || 0,
        transactionDate,
      },
    };

    console.log('Collection Data:', collectionData);

    // TODO: Call API to submit collection
    // submitCollectionAPI(collectionData);

    Alert.alert(
      'Collection Recorded',
      `₹${receivedAmt} collected from ${customerName} via ${modeOfPayment}`,
      [
        {
          text: 'OK',
          onPress: onClose,
        },
      ],
    );
  };

  const handleClear = () => {
    setCollectPersonName('');
    setReceivedBy('');
    setHeaderRemark('');
    setReceiptNo('');
    setCustomerId('');
    setCustomerName('');
    setInvoiceId('');
    setInvNo('');
    setInvDate('');
    setInvAmt('');
    setOutstandingAmt('');
    setCollectedAmt('');
    setReceivedAmt('');
    setModeOfPayment('Cash');
    setChequeDate('');
    setRefNo('');
    setDetailRemark('');
    setCollectType('Invoice');
    setDiscount('');
    setTds('');
    setCheckBank('');
    setChequeNo('');
    setTransactionDate('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Icon name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>New Collection Entry</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section: Collection Header */}
          <View style={styles.sectionHeader}>
            <Icon name="receipt" size={20} color="#1e88e5" />
            <Text style={styles.sectionTitle}>Collection Header</Text>
          </View>

          {/* Collect Person Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Collector Name *</Text>
            <TextInput
              style={styles.input}
              value={collectPersonName}
              onChangeText={setCollectPersonName}
              placeholder="Enter collector/person name"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          {/* Received By */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Received By</Text>
            <TextInput
              style={styles.input}
              value={receivedBy}
              onChangeText={setReceivedBy}
              placeholder="Enter receiver name"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          {/* Received On */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Received On *</Text>
            <TextInput
              style={styles.input}
              value={receivedOn}
              onChangeText={setReceivedOn}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
            />
          </View>

          {/* Receipt Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Receipt Number</Text>
            <TextInput
              style={styles.input}
              value={receiptNo}
              onChangeText={setReceiptNo}
              placeholder="Enter receipt number"
              placeholderTextColor="#999"
            />
          </View>

          {/* Section: Customer & Invoice Details */}
          <View style={styles.sectionHeader}>
            <Icon name="person" size={20} color="#1e88e5" />
            <Text style={styles.sectionTitle}>Customer & Invoice Details</Text>
          </View>

          {/* Collection Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Collection Type *</Text>
            <View style={styles.chipsContainer}>
              {collectionTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    collectType === type && styles.chipActive,
                  ]}
                  onPress={() => setCollectType(type)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      collectType === type && styles.chipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Customer Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Enter customer name"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          {/* Invoice Fields - Show only for Invoice type */}
          {collectType === 'Invoice' && (
            <>
              {/* Invoice Number */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Invoice Number *</Text>
                <TextInput
                  style={styles.input}
                  value={invNo}
                  onChangeText={setInvNo}
                  placeholder="Enter invoice number"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Invoice Date */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Invoice Date</Text>
                <TextInput
                  style={styles.input}
                  value={invDate}
                  onChangeText={setInvDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Invoice Amount */}
              <View style={styles.row}>
                <View
                  style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}
                >
                  <Text style={styles.label}>Invoice Amount</Text>
                  <View style={styles.amountWrapper}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput
                      style={styles.amountInputSmall}
                      value={invAmt}
                      onChangeText={text => {
                        const cleaned = text.replace(/[^0-9.]/g, '');
                        if (/^\d*\.?\d{0,4}$/.test(cleaned)) {
                          setInvAmt(cleaned);
                        }
                      }}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#aaa"
                    />
                  </View>
                </View>

                {/* Outstanding Amount */}
                <View
                  style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}
                >
                  <Text style={styles.label}>Outstanding</Text>
                  <View style={styles.amountWrapper}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput
                      style={styles.amountInputSmall}
                      value={outstandingAmt}
                      onChangeText={text => {
                        const cleaned = text.replace(/[^0-9.]/g, '');
                        if (/^\d*\.?\d{0,4}$/.test(cleaned)) {
                          setOutstandingAmt(cleaned);
                        }
                      }}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#aaa"
                    />
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Section: Payment Details */}
          <View style={styles.sectionHeader}>
            <Icon name="payment" size={20} color="#1e88e5" />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>

          {/* Collected Amount */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Collected Amount (₹) *</Text>
            <View style={styles.amountWrapperLarge}>
              <Text style={styles.rupeeLarge}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={collectedAmt}
                onChangeText={text => {
                  const cleaned = text.replace(/[^0-9.]/g, '');
                  if (/^\d*\.?\d{0,4}$/.test(cleaned)) {
                    setCollectedAmt(cleaned);
                  }
                }}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {/* Discount and TDS */}
          <View style={styles.row}>
            <View style={[styles.fieldContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Discount</Text>
              <View style={styles.amountWrapper}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput
                  style={styles.amountInputSmall}
                  value={discount}
                  onChangeText={text => {
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    if (/^\d*\.?\d{0,2}$/.test(cleaned)) {
                      setDiscount(cleaned);
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            <View style={[styles.fieldContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>TDS</Text>
              <View style={styles.amountWrapper}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput
                  style={styles.amountInputSmall}
                  value={tds}
                  onChangeText={text => {
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    if (/^\d*\.?\d{0,2}$/.test(cleaned)) {
                      setTds(cleaned);
                    }
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
          </View>

          {/* Received Amount (Calculated) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Received Amount (After Deductions)</Text>
            <View
              style={[
                styles.amountWrapperLarge,
                { backgroundColor: '#e8f5e9' },
              ]}
            >
              <Text
                style={[
                  styles.rupeeLarge,
                  { backgroundColor: '#c8e6c9', color: '#2e7d32' },
                ]}
              >
                ₹
              </Text>
              <TextInput
                style={[
                  styles.amountInput,
                  { color: '#2e7d32', fontWeight: '700' },
                ]}
                value={receivedAmt}
                editable={false}
                placeholder="0.00"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          {/* Payment Mode */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mode of Payment *</Text>
            <View style={styles.chipsContainer}>
              {paymentModes.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.chip,
                    modeOfPayment === m && styles.chipActive,
                  ]}
                  onPress={() => setModeOfPayment(m)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      modeOfPayment === m && styles.chipTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cheque Details - shown only for Cheque mode */}
          {modeOfPayment === 'Cheque' && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Cheque Number *</Text>
                <TextInput
                  style={styles.input}
                  value={chequeNo}
                  onChangeText={setChequeNo}
                  placeholder="Enter cheque number"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Cheque Date *</Text>
                <TextInput
                  style={styles.input}
                  value={chequeDate}
                  onChangeText={setChequeDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Bank Name *</Text>
                <TextInput
                  style={styles.input}
                  value={checkBank}
                  onChangeText={setCheckBank}
                  placeholder="Enter bank name"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          {/* Reference - shown for UPI / Bank Transfer */}
          {(modeOfPayment === 'UPI' || modeOfPayment === 'Bank Transfer') && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Transaction Reference Number *</Text>
                <TextInput
                  style={styles.input}
                  value={refNo}
                  onChangeText={setRefNo}
                  placeholder={
                    modeOfPayment === 'UPI'
                      ? 'UPI Transaction ID'
                      : 'Bank Reference Number'
                  }
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Transaction Date</Text>
                <TextInput
                  style={styles.input}
                  value={transactionDate}
                  onChangeText={setTransactionDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                />
              </View>
            </>
          )}

          {/* Remarks */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Remarks / Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={detailRemark}
              onChangeText={setDetailRemark}
              multiline
              numberOfLines={4}
              placeholder="Any additional details..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>

          {/* Header Remarks */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Header Remarks</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={headerRemark}
              onChangeText={setHeaderRemark}
              multiline
              numberOfLines={3}
              placeholder="Overall collection notes..."
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClear}>
              <Icon name="clear" size={20} color="#555" />
              <Text style={styles.cancelButtonText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Icon name="check-circle" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Submit Collection</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e88e5',
  },
  fieldContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#111',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  amountWrapperLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e88e5',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8fcff',
  },
  rupee: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#eeeeee',
  },
  rupeeLarge: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e88e5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#e3f2fd',
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 12,
    color: '#111',
  },
  amountInputSmall: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
    color: '#111',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  chipActive: {
    backgroundColor: '#1e88e5',
    borderColor: '#1e88e5',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#1e88e5',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#1e88e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default CollectionEntryScreen;
