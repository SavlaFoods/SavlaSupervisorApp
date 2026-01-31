// src/config/roleConfig.ts

export const ROLES = {
  FIELD_COLLECTION: '4',
  ACCOUNT_USER: '10',
  // add more roles here later
} as const;

// Which tabs appear in the bottom navigation bar
export const allowedTabsByRole: Record<string, string[]> = {
  [ROLES.FIELD_COLLECTION]: ['home', 'reports'],
  [ROLES.ACCOUNT_USER]: ['home', 'profile'],
  default: ['home'],
};

// Which screens this role is allowed to access
export const allowedScreensByRole: Record<string, string[]> = {
  [ROLES.FIELD_COLLECTION]: [
    'HomeScreen',
    'OutstandingReportScreen',
    'CollectionEntryScreen', // ← use consistent name
  ],
  [ROLES.ACCOUNT_USER]: [
    'HomeScreen',
    // 'OutstandingReportScreen',
    // 'CollectionEntryScreen',    // ← only if account user should also have it
  ],
  default: ['HomeScreen'],
};

// Quick action buttons/cards shown on Home screen
export const allowedHomeActionsByRole: Record<string, string[]> = {
  [ROLES.FIELD_COLLECTION]: [
    'outstanding-report',
    'new-collection', // ← this enables the Collection card
  ],
  [ROLES.ACCOUNT_USER]: ['outstanding-report'],
  default: [],
};
