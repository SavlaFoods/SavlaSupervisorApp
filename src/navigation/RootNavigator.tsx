// src/navigation/ReportsNavigator.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const TopTab = createMaterialTopTabNavigator();

function OutstandingReportScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Simulate / replace with real API call
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://your-api-base.com/outstanding-report',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({
              customerName: 'UNICORP ENTERPRISES',
              unit: ['D-39'],
              fromDate: '01/12/2025',
              toDate: '01/01/2026',
            }),
          },
        );

        const json = await response.json();
        if (json.success) {
          setData(json);
        } else {
          setError(json.message || 'Failed to load report');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#555' }}>
          Loading outstanding invoices...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#d32f2f', fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  const { summary, headers, reportData } = data;

  return (
    <ScrollView style={styles.container}>
      {/* Summary row */}
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>Total Outstanding</Text>
          <Text style={styles.value}>
            ₹{Number(summary.totalOutstandingAmount).toLocaleString('en-IN')}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.label}>No. of Invoices</Text>
          <Text style={styles.value}>{summary.outstandingInvoices}</Text>
        </View>
      </View>

      {/* Horizontal scrollable table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header */}
          <View style={styles.tableHeader}>
            {headers.map((h: string, i: number) => (
              <Text key={i} style={[styles.cell, styles.headerText]}>
                {h}
              </Text>
            ))}
          </View>

          {/* Rows */}
          {reportData.map((row: any[], idx: number) => (
            <View key={idx} style={styles.row}>
              {row.map((cell, cellIdx) => (
                <Text
                  key={cellIdx}
                  style={[
                    styles.cell,
                    cellIdx === 0 && { fontWeight: '600' }, // Sr. No. bold
                  ]}
                >
                  {typeof cell === 'number' && cellIdx !== 0
                    ? Number(cell).toLocaleString('en-IN')
                    : cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

function ReportsNavigator() {
  return (
    <TopTab.Navigator
      initialRouteName="Outstanding"
      screenOptions={{
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#757575',
        tabBarIndicatorStyle: { backgroundColor: '#1976d2', height: 4 },
        tabBarLabelStyle: { fontWeight: '600', textTransform: 'none' },
      }}
    >
      <TopTab.Screen name="Outstanding" component={OutstandingReportScreen} />
      {/* Add more later */}
      {/* <TopTab.Screen name="Paid" component={PaidReportsScreen} /> */}
      {/* <TopTab.Screen name="Overdue" component={OverdueScreen} /> */}
    </TopTab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  summary: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: { fontSize: 13, color: '#616161', marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '700', color: '#1976d2' },

  tableHeader: { flexDirection: 'row', backgroundColor: '#e3f2fd' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e0e0e0' },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    minWidth: 110,
    fontSize: 13,
  },
  headerText: { fontWeight: '700', color: '#424242' },
});

export default ReportsNavigator;
