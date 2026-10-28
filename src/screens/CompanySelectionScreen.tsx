import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { storeUserData, getUserData, getToken } from '../utils/storage';
import {
  API_ENDPOINTS,
  getAuthHeaders,
  ApiError,
  Company,
  CompanyDetailsResponse,
} from '../config/apiConfig';
import { RootStackParamList } from './MainApp';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const THEME = {
  primary: '#1a5fb4',
  primaryLight: '#e3f2fd',
  bg: '#f5f5f5',
  card: '#ffffff',
  border: '#e0e0e0',
  text: '#1a1a1a',
  subtext: '#666666',
  muted: '#999999',
  danger: '#c62828',
  dangerBg: '#fdecea',
  success: '#4caf50',
};

// NOTE: Assumption — the API now returns a `Units` array on each Company
// object (since you said the unit is already coming through the same
// CompanyDetails API). If `Company` in apiConfig.ts doesn't declare this
// field yet, add it there:
//
//   export interface Unit {
//     UnitId: number | string;
//     UnitName: string;
//   }
//
//   export interface Company {
//     ...
//     Units: Unit[];
//   }
//
// Using a local type here so this file compiles even before you update
// apiConfig.ts. Once you add `Units` to `Company` there, you can delete
// this and just use `Company` directly.
interface Unit {
  UnitId: number | string;
  UnitName: string;
}
type CompanyWithUnits = Company & { Units?: Unit[] };

const CompanySelectionScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [companies, setCompanies] = useState<CompanyWithUnits[]>([]);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyWithUnits | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let token: string | undefined;
      try {
        token = (await getToken()) || undefined;
      } catch {
        token = undefined;
      }
      const headers = await getAuthHeaders(token);
      const url = `${API_ENDPOINTS.COMPANY_DETAILS}`;

      const res = await fetch(url, {
        method: 'GET',
        headers,
      });

      const rawText = await res.text();

      let data: CompanyDetailsResponse;
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

      if (!res.ok) {
        throw {
          message: (data as any)?.message || 'Failed to load companies',
          status: res.status,
        } as ApiError;
      }

      const companyList = (data.output || []) as CompanyWithUnits[];
      setCompanies(companyList);

      if (companyList.length === 1) {
        setSelectedCompany(companyList[0]);
        // Auto-select unit too if the single company has exactly one unit
        if (companyList[0].Units && companyList[0].Units.length === 1) {
          setSelectedUnit(companyList[0].Units[0]);
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error('[CompanySelectionScreen] fetchCompanies error:', apiError);
      setErrorMessage(
        apiError.message || 'Failed to load companies. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCompany = (company: CompanyWithUnits) => {
    setSelectedCompany(company);
    setSelectedUnit(null); // reset unit whenever company changes
    setDropdownVisible(false);
    setErrorMessage('');
  };

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setUnitDropdownVisible(false);
    setErrorMessage('');
  };

  const availableUnits: Unit[] = selectedCompany?.Units || [];

  const handleContinue = async () => {
    if (!selectedCompany) {
      setErrorMessage('Please select a company to continue');
      return;
    }

    if (availableUnits.length > 0 && !selectedUnit) {
      setErrorMessage('Please select a unit to continue');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const existingUser = (await getUserData()) || {};
      await storeUserData({
        ...existingUser,
        selectedCompany,
        selectedUnit, // persist unit alongside company
      });
      navigation.replace('Home');
    } catch (error) {
      console.error(
        '[CompanySelectionScreen] store company/unit error:',
        error,
      );
      Alert.alert(
        'Error',
        'Could not save your company selection. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue =
    !!selectedCompany && (availableUnits.length === 0 || !!selectedUnit);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.centerWrap,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🏢</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Select Company</Text>
            <Text style={styles.subtitle}>
              Choose the company you want to work with
            </Text>

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {isLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={THEME.primary} size="large" />
                <Text style={styles.loadingText}>Loading companies...</Text>
              </View>
            ) : (
              <>
                {/* Company Dropdown trigger */}
                <TouchableOpacity
                  style={styles.dropdownTrigger}
                  onPress={() => setDropdownVisible(true)}
                  activeOpacity={0.7}
                  disabled={companies.length === 0}
                >
                  <Text
                    style={[
                      styles.dropdownTriggerText,
                      !selectedCompany && styles.dropdownPlaceholder,
                    ]}
                    numberOfLines={1}
                  >
                    {selectedCompany
                      ? selectedCompany.CompanyName
                      : 'Select a company'}
                  </Text>
                  <Text style={styles.dropdownChevron}>▾</Text>
                </TouchableOpacity>

                {companies.length === 0 && (
                  <TouchableOpacity
                    style={styles.retryRow}
                    onPress={fetchCompanies}
                  >
                    <Text style={styles.retryText}>
                      Retry loading companies
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Unit Dropdown trigger — only shows once a company with units is selected */}
                {selectedCompany && availableUnits.length > 0 && (
                  <TouchableOpacity
                    style={[styles.dropdownTrigger, styles.unitDropdownTrigger]}
                    onPress={() => setUnitDropdownVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownTriggerText,
                        !selectedUnit && styles.dropdownPlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {selectedUnit ? selectedUnit.UnitName : 'Select a unit'}
                    </Text>
                    <Text style={styles.dropdownChevron}>▾</Text>
                  </TouchableOpacity>
                )}

                {/* Selected company status pill */}
                {selectedCompany && (
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            selectedCompany.Status === 'ACTIVE'
                              ? THEME.success
                              : THEME.danger,
                        },
                      ]}
                    />
                    <Text style={styles.statusRowText}>
                      {selectedCompany.Status === 'ACTIVE'
                        ? 'Active company'
                        : selectedCompany.Status}
                    </Text>
                  </View>
                )}

                {/* Continue button */}
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    (isSubmitting || !canContinue) &&
                      styles.continueButtonDisabled,
                  ]}
                  onPress={handleContinue}
                  disabled={isSubmitting || !canContinue}
                  activeOpacity={0.85}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.continueButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Company Dropdown: centered dialog, company name only */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalDialog}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Company</Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={companies}
              keyExtractor={item => String(item.CompanyId)}
              renderItem={({ item }) => {
                const isSelected =
                  selectedCompany?.CompanyId === item.CompanyId;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                    ]}
                    onPress={() => handleSelectCompany(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[  
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.CompanyName}
                    </Text>
                    {isSelected && <Text style={styles.optionCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={styles.optionSeparator} />
              )}
              style={styles.optionList}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Unit Dropdown: centered dialog, unit name only */}
      <Modal
        visible={unitDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUnitDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setUnitDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalDialog}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Unit</Text>
              <TouchableOpacity
                onPress={() => setUnitDropdownVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableUnits}
              keyExtractor={item => String(item.UnitId)}
              renderItem={({ item }) => {
                const isSelected = selectedUnit?.UnitId === item.UnitId;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                    ]}
                    onPress={() => handleSelectUnit(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.UnitName}
                    </Text>
                    {isSelected && <Text style={styles.optionCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={styles.optionSeparator} />
              )}
              style={styles.optionList}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    minHeight: height - 40,
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconText: {
    fontSize: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.subtext,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },

  errorBanner: {
    width: '100%',
    backgroundColor: THEME.dangerBg,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
    borderLeftWidth: 3,
    borderLeftColor: THEME.danger,
  },
  errorText: {
    color: THEME.danger,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },

  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: THEME.subtext,
    fontWeight: '500',
  },

  dropdownTrigger: {
    width: '100%',
    height: 52,
    backgroundColor: THEME.bg,
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitDropdownTrigger: {
    marginTop: 12,
  },
  dropdownTriggerText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    flex: 1,
    marginRight: 8,
    textAlign: 'center',
  },
  dropdownPlaceholder: {
    color: THEME.muted,
    fontWeight: '400',
  },
  dropdownChevron: {
    fontSize: 14,
    color: THEME.subtext,
    position: 'absolute',
    right: 16,
  },
  retryRow: {
    marginTop: 12,
    alignItems: 'center',
  },
  retryText: {
    color: THEME.primary,
    fontWeight: '600',
    fontSize: 13,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusRowText: {
    fontSize: 12,
    color: THEME.subtext,
    fontWeight: '600',
  },

  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: THEME.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#9db8dd',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Centered modal dialog
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalDialog: {
    width: Math.min(width - 48, 400),
    maxHeight: '60%',
    backgroundColor: THEME.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text,
  },
  modalClose: {
    fontSize: 16,
    color: THEME.subtext,
  },
  optionList: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionRowSelected: {
    backgroundColor: THEME.primaryLight,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text,
    flex: 1,
    marginRight: 8,
  },
  optionTextSelected: {
    color: THEME.primary,
    fontWeight: '700',
  },
  optionCheck: {
    fontSize: 15,
    color: THEME.primary,
    fontWeight: '700',
  },
  optionSeparator: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 8,
  },
});

export default CompanySelectionScreen;
