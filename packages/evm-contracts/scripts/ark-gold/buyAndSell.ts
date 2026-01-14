import { ethers, network } from "hardhat";

// ------------------------------------------------------------
// [설정] 배포된 컨트랙트 주소를 여기에 입력하세요!
// ------------------------------------------------------------
const ADDRESS = {
  MockUSDT: "0xd9a1Fb1AF398E4555c92943BBCEB8D6F4C25d742",         // 배포된 MockUSDT 주소
  ArkGoldExchanger: "0x611F976cAdA5d02D744CfA9Ffc05e9d491e7d529", // 배포된 ArkGoldExchanger 주소
  ArkGold: "0x5C32E009922B30a62F486843D12476D58aA83D70",          // 배포된 ArkGold 주소
};

async function main() {
  console.log(`\n🚀 Starting Buy & Sell Test on ${network.name}...`);

  const [deployer] = await ethers.getSigners();
  console.log(`👤 User (Deployer): ${deployer.address}`);

  // 1. 컨트랙트 연결
  const usdt = await ethers.getContractAt("MockUSDT", ADDRESS.MockUSDT);
  const exchanger = await ethers.getContractAt("ArkGoldExchanger", ADDRESS.ArkGoldExchanger);
  const arkGold = await ethers.getContractAt("ArkGold", ADDRESS.ArkGold);

  // 2. 현재 금 가격 조회
  console.log("\n📊 Checking Gold Price...");
  const pricePerOunce = await exchanger.getGoldPrice();
  // pricePerOunce는 18 decimals ($4622.30 * 10^18)
  console.log(`   Current Price: $${ethers.utils.formatUnits(pricePerOunce, 18)} / Oz`);

  // 3. 목표: 20 ArkGold (20 Oz) 구매 계산
  const targetGoldAmount = ethers.utils.parseUnits("20", 18); // 20 tokens
  
  // 필요 USDT 계산 (역산)
  // Logic: usdtNeeded = (GoldAmount * Price) / 1e18 / 1e12 (Decimal Adjust)
  // Safe Math: (20 * 1e18 * price) / 1e30
  const costInUsdt18 = targetGoldAmount.mul(pricePerOunce).div(ethers.utils.parseUnits("1", 18));
  const costInUsdt6 = costInUsdt18.div(ethers.utils.parseUnits("1", 12));
  
  // 여유분 조금 더해서 계산 (Rounding issue 방지)
  const buyAmountUSDT = costInUsdt6.add(ethers.utils.parseUnits("1", 6)); // + $1 buffer

  console.log(`   Target: 20 Oz`);
  console.log(`   Estimated Cost: ${ethers.utils.formatUnits(buyAmountUSDT, 6)} USDT`);

  // 4. USDT 잔액 확인 및 확보
  let usdtBalance = await usdt.balanceOf(deployer.address);
  console.log(`\n💰 Current USDT Balance: ${ethers.utils.formatUnits(usdtBalance, 6)}`);

  if (usdtBalance.lt(buyAmountUSDT)) {
    console.log("   ⚠️ USDT Insufficient. Minting from Faucet (Deployer only)...");
    // MockUSDT는 생성자가 100만불을 가지므로, Deployer가 실행한다면 이미 충분할 것입니다.
    // 만약 부족하다면 faucet 호출 (MockUSDT faucet은 1000불씩 줌 -> 반복 필요할수도)
    const tx = await usdt.faucet();
    await tx.wait();
    console.log("   ✅ Faucet Called");
  }

  // 5. Approve (USDT 사용 승인)
  console.log("\n🔓 Approving USDT...");
  const approveTx = await usdt.approve(exchanger.address, buyAmountUSDT);
  await approveTx.wait();
  console.log("   ✅ Approved");

  // 6. [BUY] Gold 구매 실행
  console.log(`\n🛒 Buying 20 ArkGold...`);
  const buyTx = await exchanger.buyGold(buyAmountUSDT, 0); // minOut 0 (Test)
  console.log(`   Tx Hash: ${buyTx.hash}`);
  await buyTx.wait();
  console.log("   ✅ Buy Confirmed!");

  // 잔액 확인
  const goldBalance = await arkGold.balanceOf(deployer.address);
  console.log(`   🦁 ArkGold Balance: ${ethers.utils.formatUnits(goldBalance, 18)} Oz`);

  // 7. [SELL] Gold 판매 실행
  console.log(`\n📉 Selling 20 ArkGold...`);
  // ArkGold는 Exchanger가 Burner Role이 있으므로 별도 Approve 불필요 (코드 로직상)
  
  const sellTx = await exchanger.sellGold(targetGoldAmount, 0); // minOut 0 (Test)
  console.log(`   Tx Hash: ${sellTx.hash}`);
  await sellTx.wait();
  console.log("   ✅ Sell Confirmed!");

  // 최종 잔액 확인
  const finalGoldBalance = await arkGold.balanceOf(deployer.address);
  const finalUsdtBalance = await usdt.balanceOf(deployer.address);

  console.log("\n🎉 Test Finished!");
  console.log(`   Final ArkGold: ${ethers.utils.formatUnits(finalGoldBalance, 18)} Oz`);
  console.log(`   Final USDT: ${ethers.utils.formatUnits(finalUsdtBalance, 6)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});