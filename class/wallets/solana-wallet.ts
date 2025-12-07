import { AbstractWallet } from './abstract-wallet';
import { BitcoinUnit, Chain } from '../../models/bitcoinUnits';
import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export class SolanaWallet extends AbstractWallet {
  static readonly type = 'solana';
  static readonly typeReadable = 'Solana';

  // @ts-ignore: override
  public readonly type = SolanaWallet.type;
  // @ts-ignore: override
  public readonly typeReadable = SolanaWallet.typeReadable;

  constructor() {
    super();
    this.chain = Chain.OFFCHAIN;
    this.preferredBalanceUnit = BitcoinUnit.BTC;
  }

   static fromJson(obj: string): SolanaWallet {
    const obj2 = JSON.parse(obj);
    const temp = new this();
    for (const key2 of Object.keys(obj2)) {
      // @ts-ignore
      temp[key2] = obj2[key2];
    }
    return temp;
  }

  getBalance(): number {
    return this.balance;
  }

  getAddress(): string {
    return this._address as string;
  }

   getAddressAsync(): Promise<string> {
    return Promise.resolve(this.getAddress());
  }

  getLatestTransactionTime(): string | 0 {
    return 0;
  }

  async generate(): Promise<void> {
    const keypair = Keypair.generate();
    this.secret = bs58.encode(keypair.secretKey);
    this._address = keypair.publicKey.toBase58();
    this.label = 'Solana Wallet';
  }

  getSecret(): string {
    return this.secret;
  }

  // Stubs

  async fetchBalance(): Promise<void> {
    try {
        const connection = new Connection(clusterApiUrl('mainnet-beta'));
        if (this._address) {
            const publicKey = new PublicKey(this._address);
            const balance = await connection.getBalance(publicKey);
            this.balance = balance / 1e9; // Convert Lamports to SOL to match ETH float approach
            console.log('SOL Balance:', this.balance);
        }
    } catch (e) {
        console.error('Error fetching SOL balance:', e);
    }
  }

  async fetchTransactions(): Promise<void> {
     try {
         const connection = new Connection(clusterApiUrl('mainnet-beta'));
         if (this._address) {
             const publicKey = new PublicKey(this._address);
             // Limit to last 10 signatures for basic activity check
             const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
             console.log('SOL Transaction count (recent):', signatures.length);
         }
     } catch (e) {
         console.error('Error fetching SOL transactions:', e);
     }
  }

  getTransactions(): any[] {
      return [];
  }

  isAddressValid(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch (e) {
        return false;
    }
  }

  _txs_by_external_index: any = {};
  _txs_by_internal_index: any = {};

  timeToRefreshBalance(): boolean {
      return false;
  }

  timeToRefreshTransaction(): boolean {
      return false;
  }

  getUtxo() {
      return [];
  }

  async fetchUtxo() {
      // no-op
  }

  addressIsChange(address: string) {
      return false;
  }

  broadcastTx(txhex: string) {
      throw new Error('Not implemented');
  }

  coinselect(utxos: any, targets: any, feeRate: any) {
      return { inputs: [], outputs: [], fee: 0 };
  }

   _getWIFbyAddress(address: string) {
      return this.secret;
  }
}
