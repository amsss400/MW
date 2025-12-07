import { AbstractWallet } from './abstract-wallet';
import { BitcoinUnit, Chain } from '../../models/bitcoinUnits';
import { ethers } from 'ethers';
// @ts-ignore
import { NEXT_PUBLIC_INFURA_GAS_API_KEY } from '@env';

export class EthereumWallet extends AbstractWallet {
  static readonly type = 'ethereum';
  static readonly typeReadable = 'Ethereum';

  // @ts-ignore: override
  public readonly type = EthereumWallet.type;
  // @ts-ignore: override
  public readonly typeReadable = EthereumWallet.typeReadable;

  constructor() {
    super();
    this.chain = Chain.OFFCHAIN;
    this.preferredBalanceUnit = BitcoinUnit.BTC;
  }

  static fromJson(obj: string): EthereumWallet {
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
    const wallet = ethers.Wallet.createRandom();
    this.secret = wallet.privateKey;
    this._address = wallet.address;
    this.label = 'Ethereum Wallet';
  }

  getSecret(): string {
    return this.secret;
  }

  // Stubs to satisfy TypeScript and existing App logic

  async fetchBalance(): Promise<void> {
    try {
      const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${NEXT_PUBLIC_INFURA_GAS_API_KEY}`);
      if (this._address) {
        const balance = await provider.getBalance(this._address);
        // Store as ETH unit (float) to avoid Number overflow with Wei (18 decimals)
        // Compromise: AbstractWallet.balance is type number.
        this.balance = Number(ethers.formatEther(balance));
        console.log('ETH Balance:', this.balance);
      }
    } catch (e) {
      console.error('Error fetching ETH balance:', e);
    }
  }

  async fetchTransactions(): Promise<void> {
     // Basic implementation for fetching transaction count as a proxy for activity
     try {
        const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${NEXT_PUBLIC_INFURA_GAS_API_KEY}`);
        if (this._address) {
            const count = await provider.getTransactionCount(this._address);
            console.log('ETH Transaction count:', count);
            // In a real app, use Etherscan API or similar for full transaction history
        }
     } catch (e) {
         console.error('Error fetching ETH transactions:', e);
     }
  }

  getTransactions(): any[] {
      return [];
  }

  isAddressValid(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Properties accessed by blue-app.ts but not present in AbstractWallet
  _txs_by_external_index: any = {};
  _txs_by_internal_index: any = {};

  timeToRefreshBalance(): boolean {
      return false; // For now
  }

  timeToRefreshTransaction(): boolean {
      return false; // For now
  }

  // CoinControl stubs
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
      return this.secret; // Simplify for now
  }
}
