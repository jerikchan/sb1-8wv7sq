import { Wallet } from 'ethers';

export async function generateCustomWallet(suffix: string): Promise<{
  address: string;
  privateKey: string;
  attempts: number;
}> {
  suffix = suffix.toLowerCase();
  let attempts = 0;
  
  while (true) {
    attempts++;
    const wallet = Wallet.createRandom();
    const address = wallet.address.toLowerCase();
    
    if (address.endsWith(suffix)) {
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        attempts,
      };
    }
    
    // Add a small delay every 1000 attempts to prevent browser freezing
    if (attempts % 1000 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}