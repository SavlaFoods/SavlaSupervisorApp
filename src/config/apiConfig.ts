// // // src/config/apiConfig.ts

// // const YOUR_COMPUTER_IP = '202.189.234.140'; // Replace with your IP
// // const PORT = '5000';

// // export const API_BASE_URL = `http://${YOUR_COMPUTER_IP}:${PORT}/sf`;

// // export const API_ENDPOINTS = {
// //   // Auth endpoints
// //   LOGIN: `${API_BASE_URL}/supervisor/getUser`,
// //   OUTSTANDING_REPORT: '${API_BASE_URL}/supervisor/outstandingReport',
// // };

// // export const DEFAULT_HEADERS = {
// //   'Content-Type': 'application/json',
// //   Accept: 'application/json',
// // };

// // // Function to get headers with auth token
// // export const getAuthHeaders = async (token?: string) => {
// //   return {
// //     ...DEFAULT_HEADERS,
// //     ...(token && { Authorization: `Bearer ${token}` }),
// //   };
// // };

// // // API Response Types
// // export interface LoginRequest {
// //   login_name: string;
// //   user_password: string;
// // }

// // export interface LoginResponse {
// //   input: {
// //     login_name: string;
// //   };
// //   output: {
// //     UserTypeID: number;
// //     LoginName: string;
// //     DisplayName: string;
// //     RoleID: number;
// //     Email: string;
// //     MobileNo: number;
// //     AltMobileNo: number | null;
// //     Birthdate: string | null;
// //     Address: string | null;
// //     Permissions: {
// //       CanAdd: string;
// //       CanEdit: string;
// //       CanDelete: string;
// //     };
// //     ExportModule: string | null;
// //     ExportRoleID: number | null;
// //     AnniversaryDate: string | null;
// //     token: string;
// //   };
// // }

// // export interface ApiError {
// //   message: string;
// //   status?: number;
// //   data?: any;
// // }

// // src/config/apiConfig.ts

// const YOUR_COMPUTER_IP = '202.189.234.140'; // Replace with your IP
// const PORT = '5000';

// export const API_BASE_URL = `http://${YOUR_COMPUTER_IP}:${PORT}/sf`;

// export const API_ENDPOINTS = {
//   // Auth endpoints
//   LOGIN: `${API_BASE_URL}/supervisor/getUser`,
//   OUTSTANDING_REPORT: `${API_BASE_URL}/supervisor/outstandingReport`,

//   // Company endpoints
//   COMPANY_DETAILS: `${API_BASE_URL}/supervisor/getCompanyDetails`,
//   SEARCH_LOCATION: `${API_BASE_URL}/supervisor/search-location`,
//   LOT_HISTORY: (lotNo: string | number, companyId: string | number) =>
//     `${API_BASE_URL}/supervisor/location/${lotNo}?companyId=${companyId}`,

//   ALL_CUSTOMERS: `http://${YOUR_COMPUTER_IP}:${PORT}/sfinternal/hsnlocal/allCustomers`,
// };

// export const DEFAULT_HEADERS = {
//   'Content-Type': 'application/json',
//   Accept: 'application/json',
// };

// // Function to get headers with auth token
// export const getAuthHeaders = async (token?: string) => {
//   return {
//     ...DEFAULT_HEADERS,
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
// };

// // API Response Types

// export interface LoginRequest {
//   login_name: string;
//   user_password: string;
// }

// export interface LoginResponse {
//   input: {
//     login_name: string;
//   };
//   output: {
//     UserTypeID: number;
//     LoginName: string;
//     DisplayName: string;
//     RoleID: number;
//     Email: string;
//     MobileNo: number;
//     AltMobileNo: number | null;
//     Birthdate: string | null;
//     Address: string | null;
//     Permissions: {
//       CanAdd: string;
//       CanEdit: string;
//       CanDelete: string;
//     };
//     ExportModule: string | null;
//     ExportRoleID: number | null;
//     AnniversaryDate: string | null;
//     token: string;
//   };
// }

// // ────────────────────────────────────────────────
// // Company Details types (getCompanyDetails)
// // ────────────────────────────────────────────────
// export interface CompanyAddress {
//   Line1: string | null;
//   Line2: string | null;
//   CountryId: number | null;
//   StateId: number | null;
//   CityId: number | null;
//   PinCode: string | null;
// }

// export interface CompanyAudit {
//   CreatedBy: string | null;
//   CreatedOn: string | null;
//   UpdatedBy: string | null;
//   UpdatedOn: string | null;
// }

// export interface Company {
//   CompanyId: number;
//   CompanyName: string;
//   PanNo: string | null;
//   RegistrationNo: string | null;
//   TinNo: string | null;
//   Gstin: string | null;
//   Currency: string | null;
//   LogoImg: string | null;
//   FinancialYearFrom: string | null;
//   BooksBeginFrom: string | null;
//   Address: CompanyAddress | null;
//   ContactNo: string | null;
//   Email: string | null;
//   FaxNo: string | null;
//   Website: string | null;
//   IeccCode: string | null;
//   CstNo: string | null;
//   Status: string;
//   CompanyOwned: string | null;
//   FssaiLicenseNo: string | null;
//   FssaiLicenseValidUpto: string | null;
//   Audit?: CompanyAudit;
// }

// export interface CompanyDetailsRequest {
//   company_id: string; // pass "ALL" to fetch every company
// }

// export interface CompanyDetailsResponse {
//   input: CompanyDetailsRequest;
//   output: Company[];
// }

// export interface ApiError {
//   message: string;
//   status?: number;
//   data?: any;
// }

// export interface LocationDetail {
//   locationCode: string;
//   locationName: string;
//   subLocationCode: string;
//   subLocationName: string;
//   unitCode: string;
//   unitName: string;
//   availableQty: number;
//   totalBoxes: number;
// }

// export interface LotSearchResult {
//   lotNo: number;
//   itemName: string;
//   companyId: number;
//   companyName: string;
//   totalAvailableQty: number;
//   totalBoxes: number;
//   locations: LocationDetail[];
// }

// export interface SearchLocationResponse {
//   success: boolean;
//   page: number;
//   pageSize: number;
//   count: number;
//   data: LotSearchResult[];
// }

// export interface LotCurrentLocation {
//   STOCK_LOT_LOC_ID: number;
//   LOT_NO: number;
//   FK_ITEM_ID: number;
//   ITEM_NAME: string;
//   FK_LOCATION_ID: number;
//   LOCATION_CODE: string;
//   LOCATION_NAME: string;
//   FK_SUB_LOCATION_ID: number;
//   SUB_LOCATION_CODE: string;
//   SUB_LOCATION_NAME: string;
//   LOCATION_TYPE: string;
//   FK_UNIT_ID: number;
//   UNIT_CODE: string;
//   UNIT_NAME: string;
//   COMPANY_ID: number;
//   COMPANY_NAME: string;
//   TOTAL_BOXES: number;
//   AVAILABLE_QTY: number;
//   MULTIPLE_OWNER: 'YES' | 'NO';
//   PLACED_ON: string;
//   LAST_BILLING_DATE: string;
//   NEXT_SCHEDULE_DATE: string;
// }

// export interface LotMovementHistoryItem {
//   ID: number;
//   BOX_NO: number | null;
//   MOVED_QTY: number;
//   OLD_LOCATION_CODE: string;
//   OLD_LOCATION: string;
//   NEW_LOCATION_CODE: string;
//   NEW_LOCATION: string;
//   STATUS: string;
//   CREATEDBY: string;
//   MOVED_ON: string; // "YYYY-MM-DD HH:mm:ss"
// }

// export interface LotHistoryResponse {
//   success: boolean;
//   lotNo: string;
//   company: {
//     companyId: number;
//     companyName: string;
//   };
//   currentLocations: LotCurrentLocation[];
//   totalAvailableQty: number;
//   totalBoxes: number;
//   locationCount: number;
//   movementHistory: LotMovementHistoryItem[];
//   message?: string; // present on error responses
// }

// // ---- 3. Fetch helper (optional) --------------------------------------------
// // Follows the same pattern used in LotSearchResultsScreen (getAuthHeaders +
// // manual fetch). Add it here if you like keeping fetch calls out of screens,
// // or just inline the same logic in LotHistoryScreen as shown in that file.

// export async function fetchLotHistory(
//   lotNo: string | number,
//   companyId: string | number,
//   token?: string,
// ): Promise<LotHistoryResponse> {
//   const headers = await getAuthHeaders(token);
//   const url = API_ENDPOINTS.LOT_HISTORY(lotNo, companyId);
//   const res = await fetch(url, { method: 'GET', headers });
//   const rawText = await res.text();

//   let data: LotHistoryResponse;
//   try {
//     data = JSON.parse(rawText);
//   } catch {
//     throw {
//       message:
//         res.status === 401 || res.status === 403
//           ? 'Not authorized. Please log in again.'
//           : `Server returned an unexpected response (status ${res.status}).`,
//       status: res.status,
//     } as ApiError;
//   }

//   if (!res.ok || !data.success) {
//     throw {
//       message: data.message || 'Failed to load lot history.',
//       status: res.status,
//     } as ApiError;
//   }

//   return data;
// }

// // ---- allCustomers ---------------------------------------------------------

// export interface ApiCustomer {
//   FK_CUSTOMER_ID: number;
//   DISP_NAME: string;
//   CUSTOMER_NAME: string;
//   FK_UNIT_ID: number;
//   UNIT_NAME: string;
// }

// interface AllCustomersResponse {
//   success: boolean;
//   count: number;
//   requestedBy: string;
//   data: ApiCustomer[];
// }

// /**
//  * Fetches the full customer list for the dropdown.
//  * The API currently returns every field pre-scoped to the requesting
//  * user's unit (each row's UNIT_NAME matches), so no client-side
//  * filtering by unit is applied here.
//  */
// export async function fetchAllCustomers(): Promise<ApiCustomer[]> {
//   const json = await apiRequest<AllCustomersResponse>(
//     API_ENDPOINTS.ALL_CUSTOMERS,
//   );

//   if (!json.success) {
//     throw new Error('allCustomers request returned success: false');
//   }

//   return json.data;
// }

// src/config/apiConfig.ts

const YOUR_COMPUTER_IP = '202.189.234.140'; // Replace with your IP
const PORT = '5000';

export const API_BASE_URL = `http://${YOUR_COMPUTER_IP}:${PORT}/sf`;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/supervisor/getUser`,
  OUTSTANDING_REPORT: `${API_BASE_URL}/supervisor/outstandingReport`,

  // Company endpoints
  COMPANY_DETAILS: `${API_BASE_URL}/supervisor/getCompanyDetails`,
  SEARCH_LOCATION: `${API_BASE_URL}/supervisor/search-location`,
  LOT_HISTORY: (lotNo: string | number, companyId: string | number) =>
    `${API_BASE_URL}/supervisor/location/${lotNo}?companyId=${companyId}`,

  ALL_CUSTOMERS: `http://${YOUR_COMPUTER_IP}:${PORT}/sfinternal/hsnlocal/allCustomers`,

  SEARCH_ITEMS: `http://${YOUR_COMPUTER_IP}:${PORT}/search/SearchItems`,
};

export interface ApiSearchItem {
  ITEM_ID?: number | string;
  ITEM_NAME?: string;
  LOT_NO?: string;
  QTY?: number;
  [key: string]: any;
}

// 3) Fetch function — same shape as fetchAllCustomers (parses text first so
//    a non-JSON error page doesn't throw an opaque JSON.parse error).
export async function fetchSearchItems(
  customerId: number | string,
  unitId?: number | string,
  token?: string,
): Promise<ApiSearchItem[]> {
  const headers = await getAuthHeaders(token);

  const params = new URLSearchParams();
  params.append('customerId', String(customerId));
  if (unitId !== undefined && unitId !== null) {
    params.append('unitId', String(unitId));
  }

  const url = `${SEARCH_ITEMS}?${params.toString()}`;

  const res = await fetch(url, { method: 'GET', headers });
  const rawText = await res.text();

  let data: any;
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
      message: data?.message || 'Failed to load items',
      status: res.status,
    } as ApiError;
  }

  // Adjust this once you know the real envelope — some of your other
  // endpoints wrap results as `data.output`, so that's the default guess.
  return (data.output ||
    data.result ||
    data.items ||
    data ||
    []) as ApiSearchItem[];
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Function to get headers with auth token
export const getAuthHeaders = async (token?: string) => {
  return {
    ...DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Response Types

export interface LoginRequest {
  login_name: string;
  user_password: string;
}

export interface LoginResponse {
  input: {
    login_name: string;
  };
  output: {
    UserTypeID: number;
    LoginName: string;
    DisplayName: string;
    RoleID: number;
    Email: string;
    MobileNo: number;
    AltMobileNo: number | null;
    Birthdate: string | null;
    Address: string | null;
    Permissions: {
      CanAdd: string;
      CanEdit: string;
      CanDelete: string;
    };
    ExportModule: string | null;
    ExportRoleID: number | null;
    AnniversaryDate: string | null;
    token: string;
  };
}

// ────────────────────────────────────────────────
// Company Details types (getCompanyDetails)
// ────────────────────────────────────────────────
export interface CompanyAddress {
  Line1: string | null;
  Line2: string | null;
  CountryId: number | null;
  StateId: number | null;
  CityId: number | null;
  PinCode: string | null;
}

export interface CompanyAudit {
  CreatedBy: string | null;
  CreatedOn: string | null;
  UpdatedBy: string | null;
  UpdatedOn: string | null;
}

export interface Company {
  CompanyId: number;
  CompanyName: string;
  PanNo: string | null;
  RegistrationNo: string | null;
  TinNo: string | null;
  Gstin: string | null;
  Currency: string | null;
  LogoImg: string | null;
  FinancialYearFrom: string | null;
  BooksBeginFrom: string | null;
  Address: CompanyAddress | null;
  ContactNo: string | null;
  Email: string | null;
  FaxNo: string | null;
  Website: string | null;
  IeccCode: string | null;
  CstNo: string | null;
  Status: string;
  CompanyOwned: string | null;
  FssaiLicenseNo: string | null;
  FssaiLicenseValidUpto: string | null;
  Audit?: CompanyAudit;
}

export interface CompanyDetailsRequest {
  company_id: string; // pass "ALL" to fetch every company
}

export interface CompanyDetailsResponse {
  input: CompanyDetailsRequest;
  output: Company[];
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface LocationDetail {
  locationCode: string;
  locationName: string;
  subLocationCode: string;
  subLocationName: string;
  unitCode: string;
  unitName: string;
  availableQty: number;
  totalBoxes: number;
}

export interface LotSearchResult {
  lotNo: number;
  itemName: string;
  companyId: number;
  companyName: string;
  totalAvailableQty: number;
  totalBoxes: number;
  locations: LocationDetail[];
}

export interface SearchLocationResponse {
  success: boolean;
  page: number;
  pageSize: number;
  count: number;
  data: LotSearchResult[];
}

export interface LotCurrentLocation {
  STOCK_LOT_LOC_ID: number;
  LOT_NO: number;
  FK_ITEM_ID: number;
  ITEM_NAME: string;
  FK_LOCATION_ID: number;
  LOCATION_CODE: string;
  LOCATION_NAME: string;
  FK_SUB_LOCATION_ID: number;
  SUB_LOCATION_CODE: string;
  SUB_LOCATION_NAME: string;
  LOCATION_TYPE: string;
  FK_UNIT_ID: number;
  UNIT_CODE: string;
  UNIT_NAME: string;
  COMPANY_ID: number;
  COMPANY_NAME: string;
  TOTAL_BOXES: number;
  AVAILABLE_QTY: number;
  MULTIPLE_OWNER: 'YES' | 'NO';
  PLACED_ON: string;
  LAST_BILLING_DATE: string;
  NEXT_SCHEDULE_DATE: string;
}

export interface LotMovementHistoryItem {
  ID: number;
  BOX_NO: number | null;
  MOVED_QTY: number;
  OLD_LOCATION_CODE: string;
  OLD_LOCATION: string;
  NEW_LOCATION_CODE: string;
  NEW_LOCATION: string;
  STATUS: string;
  CREATEDBY: string;
  MOVED_ON: string; // "YYYY-MM-DD HH:mm:ss"
}

export interface LotHistoryResponse {
  success: boolean;
  lotNo: string;
  company: {
    companyId: number;
    companyName: string;
  };
  currentLocations: LotCurrentLocation[];
  totalAvailableQty: number;
  totalBoxes: number;
  locationCount: number;
  movementHistory: LotMovementHistoryItem[];
  message?: string; // present on error responses
}

// ---- 3. Fetch helper (optional) --------------------------------------------
// Follows the same pattern used in LotSearchResultsScreen (getAuthHeaders +
// manual fetch). Add it here if you like keeping fetch calls out of screens,
// or just inline the same logic in LotHistoryScreen as shown in that file.

export async function fetchLotHistory(
  lotNo: string | number,
  companyId: string | number,
  token?: string,
): Promise<LotHistoryResponse> {
  const headers = await getAuthHeaders(token);
  const url = API_ENDPOINTS.LOT_HISTORY(lotNo, companyId);
  const res = await fetch(url, { method: 'GET', headers });
  const rawText = await res.text();

  let data: LotHistoryResponse;
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
      message: data.message || 'Failed to load lot history.',
      status: res.status,
    } as ApiError;
  }

  return data;
}

// ---- allCustomers ---------------------------------------------------------

export interface ApiCustomer {
  FK_CUSTOMER_ID: number;
  DISP_NAME: string;
  CUSTOMER_NAME: string;
  FK_UNIT_ID: number;
  UNIT_NAME: string;
}

interface AllCustomersResponse {
  success: boolean;
  count: number;
  requestedBy: string;
  data: ApiCustomer[];
}

/**
 * Fetches the full customer list for the dropdown.
 * The API currently returns every field pre-scoped to the requesting
 * user's unit (each row's UNIT_NAME matches), so no client-side
 * filtering by unit is applied here.
 *
 * Follows the same fetch + getAuthHeaders pattern as fetchLotHistory
 * above, rather than a separate request helper.
 */
export async function fetchAllCustomers(
  token?: string,
): Promise<ApiCustomer[]> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(API_ENDPOINTS.ALL_CUSTOMERS, {
    method: 'GET',
    headers,
  });
  const rawText = await res.text();

  let data: AllCustomersResponse;
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
      message: 'Failed to load customers.',
      status: res.status,
    } as ApiError;
  }

  return data.data;
}
