import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { WinbaPlatformContext } from '../WinbaPlatformProvider'; // Updated from GambaPlatformProvider
import { FAKE_TOKEN_MINT } from '../TokenMetaProvider'; // Assuming this is your fake token definition

interface TokenMeta {
  name: string;
  symbol: string;
  decimals: number;
}

export const useTokenMeta = (tokenAddress: string) => {
  const [tokenMeta, setTokenMeta] = useState<TokenMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(WinbaPlatformContext); // Updated from GambaPlatformContext

  useEffect(() => {
    const fetchTokenMeta = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if the token is the fake token
        if (tokenAddress === FAKE_TOKEN_MINT) {
          setTokenMeta({
            name: 'FakeToken',
            symbol: 'FTK',
            decimals: 18,
          });
        } else {
          // Use ethers.js to fetch the token metadata from the blockchain
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(tokenAddress, [
            'function name() view returns (string)',
            'function symbol() view returns (string)',
            'function decimals() view returns (uint8)',
          ], provider);

          const name = await contract.name();
          const symbol = await contract.symbol();
          const decimals = await contract.decimals();

          setTokenMeta({ name, symbol, decimals });
        }
      } catch (err) {
        console.error('Error fetching token metadata:', err);
        setError('Failed to fetch token metadata');
      } finally {
        setIsLoading(false);
      }
    };

    if (tokenAddress) {
      fetchTokenMeta();
    }
  }, [tokenAddress]);

  return { tokenMeta, isLoading, error };
};
