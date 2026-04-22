export interface IBeitcoinTag {
  id: string;
  tag_uid: string;
  alias?: string;
  status: string;
  beitcoin_wallets?: IBeitcoinWallet[];
}

export interface IBeitcoinWallet {
  id: string;
  tag_id: string;
  balance: number;
}