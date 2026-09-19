export type AccountStatus = 'pending' | 'approved' | 'rejected';

export interface UserAccount {
  id: string;
  username: string;
  status: AccountStatus;
  rejectionReason?: string;
  createdAt: number;
}

