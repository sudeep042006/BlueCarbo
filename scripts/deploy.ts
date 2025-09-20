import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const blueCarbon = await ethers.deployContract("BlueCarbon", [deployer.address]);

  await blueCarbon.waitForDeployment();

  const contractAddress = await blueCarbon.getAddress();
  console.log(`BlueCarbon contract deployed to: ${contractAddress}`);

  // You can add post-deployment logic here, e.g., creating an initial project
  // const tx = await blueCarbon.createProject("Initial Project", "Global", 10000, ethers.parseEther("0.01"));
  // await tx.wait();
  // console.log("Created initial project.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
