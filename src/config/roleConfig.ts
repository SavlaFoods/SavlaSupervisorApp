// src/config/roleConfig.ts

export const ROLES = {
  FIELD_COLLECTION: '4',
  ACCOUNT_USER: '10',
  // add more later
} as const;

// Which tabs to show in bottom navigation
export const allowedTabsByRole: Record<string, string[]> = {
  [ROLES.FIELD_COLLECTION]: ['home', 'reports'],
  [ROLES.ACCOUNT_USER]: ['home', 'profile'],
  // default/fallback
  default: ['home'],
};

// Which main screens this role can reach
export const allowedScreensByRole: Record<string, string[]> = {
  [ROLES.FIELD_COLLECTION]: [
    'HomeScreen',
    'OutstandingReportScreen',
    // 'FieldCollectionEntryScreen',     // uncomment when you create it
  ],
  [ROLES.ACCOUNT_USER]: ['HomeScreen', 'OutstandingReportScreen'],
  // default/fallback
  default: ['HomeScreen'],
};

// Quick action cards / buttons to show on home
export const allowedHomeActionsByRole: Record<string, string[]> = {
  [ROLES.FIELD_COLLECTION]: ['outstanding-report', 'new-collection'],
  [ROLES.ACCOUNT_USER]: ['outstanding-report'],
  default: [],
};
