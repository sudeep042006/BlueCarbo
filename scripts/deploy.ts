import { ethers } from "hardhat";

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const BlueCarbon = await ethers.getContractFactory("BlueCarbon");
    const blueCarbon = await BlueCarbon.deploy(deployer.address);
    
    console.log("Deploying...");
    await blueCarbon.waitForDeployment();
    
    const contractAddress = await blueCarbon.getAddress();
    console.log("BlueCarbon deployed to:", contractAddress);

    // Optional: Create an initial project
    console.log("Creating initial project...");
    const tx = await blueCarbon.createProject(
      "Mangrove Restoration Pilot",
      "Coastal Region",
      ethers.parseUnits("1000", 0), // 1000 credits
      ethers.parseEther("0.01") // 0.01 ETH per credit
    );
    await tx.wait();
    console.log("Initial project created successfully");

  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
