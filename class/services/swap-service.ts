// @ts-ignore
import { ZEROX_API_KEY, NEXT_PUBLIC_FEE_RECIPIENT } from '@env';

interface SwapQuoteParams {
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  takerAddress?: string;
}

export class SwapService {
  private static BASE_URL = 'https://api.0x.org/swap/v1/quote';

  static async getQuote({ buyToken, sellToken, sellAmount, takerAddress }: SwapQuoteParams) {
    const params = new URLSearchParams({
      buyToken,
      sellToken,
      sellAmount,
      // Affiliate/Fee logic
      feeRecipient: NEXT_PUBLIC_FEE_RECIPIENT || '',
      buyTokenPercentageFee: '0.01', // 1% fee
    });

    if (takerAddress) {
      params.append('takerAddress', takerAddress);
    }

    try {
      const response = await fetch(`${this.BASE_URL}?${params.toString()}`, {
        headers: {
          '0x-api-key': ZEROX_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Swap Quote Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SwapService Error:', error);
      throw error;
    }
  }
}
