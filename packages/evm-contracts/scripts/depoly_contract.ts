import hre, { ethers, network } from "hardhat";
import { prompt } from "prompts";

(async () => {
  const [operator] = await ethers.getSigners();

  const contractName = "Contract Name";

  const Factory = await ethers.getContractFactory(contractName);

  // if (network.name !== "polygon") {
  //   throw new Error("Invalid Network Param");
  // }

  // const blockExplorerUrl = "https://polygonscan.com";

  const { isDeploy } = await prompt([
    {
      type: "confirm",
      name: "isDeploy",
      message: `Deploying ${contractName} Contract
      🔱 with the account: ${await operator.getAddress()}
      Running on network: ${network.name}
      Do you continue?`,
    },
  ]);

  if (!isDeploy) {
    return;
  }

    const instance = await Factory.deploy(operator.address);
    await instance.deployed();

  // const instance = Factory.attach(
  //   "0xaddress",
  // );

  // console.log(
  //   `💎 ${contractName} deployed to ${network.name} : ${instance.address}
  //       ${blockExplorerUrl}/address/${instance.address}
  //   `,
  // );

  try {
    await hre.run("verify:verify", {
      address: instance.address,
      constructorArguments: [operator.address],
      network: "polygon", // 하드햇 네트워크 설정명
    });
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(
        `💎 ${contractName} (${network.name}) [${instance.address}] 이미 검증됨`,
      );
    } else if (error.message.toLowerCase().includes("pending")) {
      console.log(
        `🟡  ${contractName} (${network.name}) [${instance.address}] 검증 대기중`,
      );
    } else {
      // console.log(
      //   `🔴 ${contractName} (${network.name}) [${instance.address}] 검증 오류: ${error.message}\n` +
      //     `수동 검증 URL: ${blockExplorerUrl}/verifyContract?a=${instance.address}`,
      // );
    }
  }
})();
