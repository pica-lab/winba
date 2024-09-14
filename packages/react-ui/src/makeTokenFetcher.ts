import { TokenMeta } from './TokenMetaProvider';

interface TokenFetcherParams {
  dollarBaseWager?: number;
}

/**
 * Creates a token metadata fetcher that batches token addresses and retrieves their info
 * from an Ethereum-compatible API.
 * @param apiUrl (API URL to fetch token metadata, such as CoinGecko, Etherscan, etc.)
 * @param apiKey (Required API key for the chosen API)
 * @returns
 */
export function makeTokenFetcher(
  apiUrl: string,
  apiKey: string,
  params: TokenFetcherParams = {}
) {
  const { dollarBaseWager = 1 } = params;

  return async (tokenAddresses: string[]) => {
    const response = await fetch(apiUrl + '?api-key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: tokenAddresses, // Replace with the appropriate parameter for the API you're using
      }),
    });

    const { result } = (await response.json()) as { result: any[] };

    const tokens = result
      .filter((x) => !!x)
      .reduce((prev, x) => {
        const info = (x as any)?.token_info; // Replace this with the actual structure of the response
        const usdPrice = info?.usdPrice; // Adjust based on the API's response structure

        const data: TokenMeta = {
          mint: x.id, // Ethereum token address
          image: x.image || info?.image,
          symbol: info?.symbol,
          decimals: info?.decimals,
          name: info?.name || info?.symbol,
          baseWager: Math.floor((dollarBaseWager / usdPrice) * (10 ** info.decimals)) || 1,
          usdPrice,
        };

        return { ...prev, [x.id]: data };
      }, {} as Record<string, TokenMeta>);

    return tokens as Record<string, TokenMeta>;
  };
}
