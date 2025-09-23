// filepath: f:\Hackathons\H-8 SIH internal Hackathon\PROTOType\BlueCarbo\src\config\constants.ts
import contractArtifact from '../../artifacts/contracts/BlueCarbon.sol/BlueCarbon.json';

export const CONTRACT_ADDRESS = '0x5D7cbB409E56B378c346E819350C6c9B8F494319';
export const NETWORK_ID = '11155111'; // Sepolia network ID
export const CONTRACT_ABI = contractArtifact.abi as const;