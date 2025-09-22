'use client';

import { useState, useEffect } from 'react';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ProjectsTable, Project } from '@/components/dashboard/projects-table';
import { SubmitProjectModal } from '@/components/dashboard/submit-project-modal';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import { BlueCarbonABI } from '@/lib/abi/BlueCarbon';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialProjects: Project[] = [
  {
    name: 'Andaman Coast Mangrove Restoration',
    location: 'Krabi, Thailand',
    area: '150 Hectares',
    status: 'Verified',
  },
  {
    name: 'Sunderbans Seagrass Initiative',
    location: 'West Bengal, India',
    area: '300 Hectares',
    status: 'Pending',
  },
  {
    name: 'Mekong Delta Reforestation',
    location: 'Soc Trang, Vietnam',
    area: '50 Hectares',
    status: 'Verified',
  },
  {
    name: 'Borneo Peatland Rewetting',
    location: 'Kalimantan, Indonesia',
    area: '500 Hectares',
    status: 'Rejected',
  },
  {
    name: 'Pacific Atoll Coral Garden',
    location: 'Funafuti, Tuvalu',
    area: '20 Hectares',
    status: 'Pending',
  },
];

// --- IMPORTANT ---
// Replace this with the actual address of your deployed BlueCarbon smart contract.
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE'; 

export default function NgoDashboardPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
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
      return; // Don't try to fetch if address isn't set
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
      toast({ variant: 'destructive', title: 'Contract Error', description: 'Could not fetch data from the smart contract. Is it deployed on the correct network?' });
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet(true); // Re-connect to get new signer and data
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
      toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'You must be the contract owner and have your wallet connected to withdraw.' });
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

  const handleAddProject = (newProjectData: Omit<Project, 'status'>) => {
    const newProject: Project = {
      ...newProjectData,
      name: newProjectData.name,
      status: 'Pending',
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">NGO Dashboard</h1>
          <p className="text-muted-foreground">An overview of your organization's projects and impact.</p>
        </div>
        <div className="flex items-center space-x-2">
          <SubmitProjectModal onProjectSubmit={handleAddProject}>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit New Project
            </Button>
          </SubmitProjectModal>
        </div>
      </div>

       {!isWalletConnected && (
         <Alert className="flex items-center justify-between">
            <div>
              <AlertTitle className="flex items-center gap-2"><Wallet className="h-4 w-4" />Connect Your Wallet</AlertTitle>
              <AlertDescription>
                  Connect to view contract balance and manage funds.
              </AlertDescription>
            </div>
            <Button onClick={() => connectWallet()} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
              Connect
            </Button>
        </Alert>
       )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCards />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contract Balance</CardTitle>
                <span className="text-muted-foreground">ETH</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{parseFloat(contractBalance).toFixed(4)}</div>
                {isOwner && isWalletConnected ? (
                    <Button size="sm" className="mt-2" onClick={handleWithdraw} disabled={isWithdrawing || parseFloat(contractBalance) === 0}>
                        {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Withdraw Funds
                    </Button>
                ) : (
                   <p className="text-xs text-muted-foreground">{isWalletConnected ? 'Only owner can withdraw' : 'Connect wallet to manage'}</p>
                )}
            </CardContent>
        </Card>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
