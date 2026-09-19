import { UserAccount, AccountStatus } from './types';

const STORAGE_KEY = 'bsp_accounts_data';
const CURRENT_ID_KEY = 'bsp_account_id';

const INITIAL_MOCK_ACCOUNTS: UserAccount[] = [
  {
    id: 'req_849201',
    username: '9847291034',
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 'req_738192',
    username: '8104829104',
    status: 'approved',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'req_629104',
    username: '7193019284',
    status: 'rejected',
    rejectionReason: 'Verification document incomplete or unreadable.',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  }
];

export function getLocalAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_ACCOUNTS));
      return INITIAL_MOCK_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_ACCOUNTS;
  }
}

export function saveLocalAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to localStorage', e);
  }
}

export function getAccountById(id: string): UserAccount | null {
  const accounts = getLocalAccounts();
  return accounts.find(a => a.id === id) || null;
}

export function updateAccountStatus(id: string, status: AccountStatus, reason?: string): UserAccount | null {
  const accounts = getLocalAccounts();
  const index = accounts.findIndex(a => a.id === id);
  if (index === -1) return null;
  accounts[index] = {
    ...accounts[index],
    status,
    rejectionReason: status === 'rejected' ? (reason || 'Admin rejected without specific reason') : undefined,
  };
  saveLocalAccounts(accounts);
  return accounts[index];
}

export function createOrUpdateClientSubmission(username: string): UserAccount {
  const accounts = getLocalAccounts();
  const existing = accounts.find(a => a.username === username);
  if (existing) {
    existing.status = 'pending';
    existing.rejectionReason = undefined;
    existing.createdAt = Date.now();
    saveLocalAccounts(accounts);
    localStorage.setItem(CURRENT_ID_KEY, existing.id);
    return existing;
  }
  const newAccount: UserAccount = {
    id: 'req_' + Math.random().toString(36).substring(2, 9),
    username,
    status: 'pending',
    createdAt: Date.now(),
  };
  accounts.unshift(newAccount);
  saveLocalAccounts(accounts);
  localStorage.setItem(CURRENT_ID_KEY, newAccount.id);
  return newAccount;
}

export function getCurrentAccountId(): string | null {
  return localStorage.getItem(CURRENT_ID_KEY);
}

export function clearCurrentAccount(): void {
  localStorage.removeItem(CURRENT_ID_KEY);
}
