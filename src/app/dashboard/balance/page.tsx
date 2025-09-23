
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Loader2, Landmark, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ethers } from 'ethers';
import { BlueCarbonABI } from '@/lib/abi/BlueCarbon';

// --- IMPORTANT ---
// Replace this with the actual address of your deployed BlueCarbon smart contract.
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE'; 

export default function BalancePage() {
  const { toast } = useToast();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const isWalletConnected = !!walletAddress;

  const getContractData = async (currentSigner: ethers.Signer) => {
    if (CONTRACT_ADDRESS === 'YOUR_CONTRACT_ADDRESS_HERE') {
      return; 
    }
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BlueCarbonABI, currentSigner);
      const balance = await currentSigner.provider!.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.formatEther(balance));

      const ownerAddress = await contract.owner();
      const connectedAddress = await currentSigner.getAddress();
      setIsOwner(ownerAddress.toLowerCase() === connectedAddress.toLowerCase());
    } catch (error) {
      console.error("Error fetching contract data:", error);
      toast({ variant: 'destructive', title: 'Contract Error', description: 'Could not fetch data from the smart contract.' });
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet(true); 
        } else {
          setWalletAddress('');
          setSigner(null);
          setProvider(null);
          setContractBalance('0');
          setIsOwner(false);
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const connectWallet = async (isSilent = false) => {
    if (CONTRACT_ADDRESS === 'YOUR_CONTRACT_ADDRESS_HERE') {
        if (!isSilent) toast({ variant: 'destructive', title: 'Setup Required', description: 'The smart contract address has not been configured.' });
        return;
    }
    if (window.ethereum) {
      setIsConnecting(true);
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send('eth_requestAccounts', []);
        const currentSigner = await browserProvider.getSigner();
        const address = await currentSigner.getAddress();
        
        setProvider(browserProvider);
        setSigner(currentSigner);
        setWalletAddress(address);
        
        await getContractData(currentSigner);

        if (!isSilent) toast({ title: 'Wallet Connected', description: `Address: ${address.substring(0, 6)}...${address.substring(address.length - 4)}` });
      } catch (error) {
        console.error(error);
        if (!isSilent) toast({ variant: 'destructive', title: 'Connection Failed', description: 'Could not connect to MetaMask.' });
      } finally {
        setIsConnecting(false);
      }
    } else {
      if (!isSilent) toast({ variant: 'destructive', title: 'MetaMask Not Found', description: 'Please install the MetaMask extension.' });
    }
  };

  const handleWithdraw = async () => {
    if (!signer || !isOwner) {
      toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'You must be the contract owner to withdraw.' });
      return;
    }
    setIsWithdrawing(true);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, BlueCarbonABI, signer);
      const tx = await contract.withdraw();
      toast({ title: 'Withdrawal Sent', description: 'Waiting for blockchain confirmation...' });
      await tx.wait();
      toast({ title: 'Withdrawal Successful!', description: 'Funds have been transferred to your wallet.' });
      await getContractData(signer); // Refresh balance
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      toast({ 
          variant: 'destructive', 
          title: 'Withdrawal Failed', 
          description: error?.data?.message || error.message || 'An error occurred during withdrawal.'
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Balance & Withdrawals</h1>
        <p className="text-muted-foreground">View funds collected from carbon credit sales and withdraw them to your wallet.</p>
      </div>

       {!isWalletConnected && (
         <Alert className="flex items-center justify-between">
            <div>
              <AlertTitle className="flex items-center gap-2"><Wallet className="h-4 w-4" />Connect Your Wallet</AlertTitle>
              <AlertDescription>
                  Connect your wallet to view contract balance and manage funds.
              </AlertDescription>
            </div>
            <Button onClick={() => connectWallet()} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
              Connect
            </Button>
        </Alert>
       )}

      <Card>
        <CardHeader>
          <CardTitle>Contract Balance</CardTitle>
          <CardDescription>
            This is the total amount of ETH held in the smart contract from carbon credit purchases.
            Only the designated contract owner can withdraw these funds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="bg-secondary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available for Withdrawal</CardTitle>
                <span className="text-muted-foreground">ETH</span>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold">{parseFloat(contractBalance).toFixed(6)}</div>
                 <p className="text-xs text-muted-foreground pt-1">
                    {isWalletConnected ? `Connected as: ${walletAddress}` : 'Please connect your wallet'}
                 </p>
            </CardContent>
          </Card>
          
           {isWalletConnected && (
                isOwner ? (
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Button 
                            className="w-full sm:w-auto"
                            onClick={handleWithdraw} 
                            disabled={isWithdrawing || parseFloat(contractBalance) === 0}
                        >
                            {isWithdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Landmark className="mr-2 h-4 w-4" />}
                            Withdraw All Funds
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            As the contract owner, you can withdraw the entire balance to your connected wallet.
                        </p>
                    </div>
                ) : (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Not Contract Owner</AlertTitle>
                        <AlertDescription>
                           Your connected wallet is not the owner of this contract, so you cannot withdraw funds.
                        </AlertDescription>
                    </Alert>
                )
           )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add window.ethereum declaration for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
