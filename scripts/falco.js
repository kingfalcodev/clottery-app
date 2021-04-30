// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main(test) {
  const Falco = await hre.ethers.getContractFactory("Falco");

  const falco = await Falco.deploy(
    hre.ethers.utils.parseEther("1000000000000000")
  );

  await falco.deployed();

  console.log("Falco deployed to:", falco.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
