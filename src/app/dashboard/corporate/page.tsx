'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Briefcase } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ethers } from 'ethers';

// Mock project data - this would come from your smart contract or a backend
const projects = [
  { id: 1, name: 'Andaman Coast Mangrove Restoration', price: 15, available: 1200 },
  { id: 2, name: 'Sunderbans Seagrass Initiative', price: 22, available: 850 },
  { id: 3, name: 'Mekong Delta Reforestation', price: 18, available: 2500 },
];

export default function CorporateDashboardPage() {
  const { toast } = useToast();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0); // Assuming this is a mock balance for now
  const [purchaseAmounts, setPurchaseAmounts] = useState<{[key: number]: number}>({});

  const isWalletConnected = !!walletAddress;

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          // In a real app, you'd fetch balance and other details for the new account
        } else {
          setWalletAddress('');
          setSigner(null);
          setProvider(null);
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        await browserProvider.send('eth_requestAccounts', []);
        const currentSigner = await browserProvider.getSigner();
        const address = await currentSigner.getAddress();
        
        setProvider(browserProvider);
        setSigner(currentSigner);
        setWalletAddress(address);
        
        // Mock token balance for demonstration
        const randomBalance = Math.floor(Math.random() * 50000) + 1000;
        setTokenBalance(randomBalance);
        
        toast({ title: 'Wallet Connected', description: `Address: ${address.substring(0, 6)}...${address.substring(address.length - 4)}` });
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Connection Failed', description: 'Could not connect to MetaMask. Please try again.' });
      }
    } else {
      toast({ variant: 'destructive', title: 'MetaMask Not Found', description: 'Please install the MetaMask extension to use this feature.' });
    }
  };

  const handlePurchase = (projectId: number) => {
    if (!signer) {
        toast({ variant: 'destructive', title: 'Wallet Not Connected', description: 'Please connect your wallet to proceed.' });
        return;
    }
    const amount = purchaseAmounts[projectId] || 0;
    if (amount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive number of credits to purchase.' });
        return;
    }
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const cost = amount * project.price;
    if (cost > tokenBalance) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: `You need ${cost.toLocaleString()} tokens, but you only have ${tokenBalance.toLocaleString()}.` });
        return;
    }

    // In a real application, you would create a transaction here to call the smart contract.
    // For example:
    // const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    // const tx = await contract.purchase(projectId, amount, { value: ethers.parseEther(cost.toString()) });
    // await tx.wait();

    console.log(`Simulating purchase of ${amount} credits from project ${projectId} for ${cost} tokens.`);
    
    setTokenBalance(prev => prev - cost);
    toast({ title: 'Purchase Successful!', description: `You purchased ${amount.toLocaleString()} credits from ${project.name} for ${cost.toLocaleString()} tokens.` });
    
    // Reset purchase amount
    setPurchaseAmounts(prev => ({...prev, [projectId]: 0}));
  };
  
  const handleAmountChange = (projectId: number, value: string) => {
    const amount = parseInt(value, 10);
    setPurchaseAmounts(prev => ({...prev, [projectId]: Math.max(0, isNaN(amount) ? 0 : amount)}));
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Briefcase /> Corporate Dashboard
          </h1>
          <p className="text-muted-foreground">Purchase and manage your blue carbon credits.</p>
        </div>
        {!isWalletConnected ? (
          <Button onClick={connectWallet} className="w-full sm:w-auto">
            <Wallet className="mr-2" /> Connect Wallet
          </Button>
        ) : (
          <Card className="w-full sm:w-auto">
            <CardContent className="p-3">
              <div className="text-sm">
                <p className="font-semibold text-green-600">Wallet Connected</p>
                <p className="text-muted-foreground truncate text-xs">{walletAddress}</p>
                <p className="font-bold text-lg">{tokenBalance.toLocaleString()} Tokens</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

       {!isWalletConnected && (
         <Alert>
            <Wallet className="h-4 w-4" />
            <AlertTitle>Connect Your Wallet</AlertTitle>
            <AlertDescription>
                Please connect your MetaMask wallet to purchase carbon credits.
            </AlertDescription>
        </Alert>
       )}

      <Card>
        <CardHeader>
          <CardTitle>Carbon Credit Marketplace</CardTitle>
          <CardDescription>Browse available projects and purchase carbon credits to offset your emissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.map(project => (
            <Card key={project.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center">
              <div className="md:col-span-1">
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.available.toLocaleString()} credits available
                </p>
                 <p className="text-lg font-bold text-primary">{project.price} Tokens / credit</p>
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 items-center">
                 <div className="flex-1 w-full">
                    <Input 
                        type="number"
                        placeholder="Amount"
                        value={purchaseAmounts[project.id] || ''}
                        onChange={(e) => handleAmountChange(project.id, e.target.value)}
                        disabled={!isWalletConnected}
                        min="0"
                    />
                    {purchaseAmounts[project.id] > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Total Cost: {(purchaseAmounts[project.id] * project.price).toLocaleString()} Tokens
                        </p>
                    )}
                 </div>
                <Button 
                  onClick={() => handlePurchase(project.id)} 
                  disabled={!isWalletConnected || !purchaseAmounts[project.id] || purchaseAmounts[project.id] <= 0}
                  className="w-full sm:w-auto"
                >
                  Purchase Credits
                </Button>
              </div>
            </Card>
          ))}
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
