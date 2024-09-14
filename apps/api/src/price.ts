import { config } from './config'

const priceData: Record<string, { lastFetch: number, usdPerUnit: number }> = {}

export const getPrices = async (
  tokens: string[],
  refreshMinutes = 10,
) => {
  // Only fetch tokens if they A. Don't exist or B. have not been fetched for (refreshMinutes) minutes
  const tokensToFetch = Array.from(new Set(tokens.filter(
    (x) => !priceData[x] || priceData[x].lastFetch < Date.now() - 6000 * refreshMinutes,
  )))

  if (!tokensToFetch.length) {
    return priceData
  }

  console.log('Fetching token prices', tokensToFetch)

  const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids: tokensToFetch.join(','),
      vs_currencies: 'usd',
    }),
  })

  const result = await response.json()

  const tokenPrices = tokensToFetch.reduce((prev, token) => {
    const price = result[token]?.usd ?? 0
    return {
      ...prev,
      [token]: price,
    }
  }, {} as Record<string, number>)

  for (const key of tokensToFetch) {
    if (tokenPrices[key] === undefined) {
      console.log('‼ No price data for', key)
    }

    priceData[key] = {
      usdPerUnit: tokenPrices[key],
      lastFetch: Date.now(),
    }
  }

  return priceData
}
