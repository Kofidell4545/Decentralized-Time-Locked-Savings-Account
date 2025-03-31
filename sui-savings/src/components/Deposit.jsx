import { useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/client";

const SUI_RPC = "https://fullnode.testnet.sui.io"; // Sui Testnet RPC

const Deposit = ({ wallet }) => {
  const [amount, setAmount] = useState("");
  const [lockTime, setLockTime] = useState("");
  const [txHash, setTxHash] = useState(null);

  const depositFunds = async () => {
    if (!wallet || !amount || !lockTime) return;

    const tx = new TransactionBlock();

    // Convert input values
    const depositAmount = parseFloat(amount) * 1e9; // Convert to MIST (smallest SUI unit)
    const unlockTimestamp = Math.floor(Date.now() / 1000) + parseInt(lockTime); // Future unlock time

    tx.moveCall({
      target: "YOUR_PACKAGE::TimeLockSavings::deposit",
      arguments: [tx.pure(depositAmount), tx.pure(unlockTimestamp)],
    });

    const response = await wallet.signAndSubmitTransactionBlock({
      transactionBlock: tx,
    });
    setTxHash(response.digest);
  };

  return (
    <div>
      <h2>Deposit SUI</h2>
      <input
        type="number"
        placeholder="Amount (SUI)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Lock time (secs)"
        value={lockTime}
        onChange={(e) => setLockTime(e.target.value)}
      />
      <button onClick={depositFunds}>Deposit</button>

      {txHash && <p>Transaction: {txHash}</p>}
    </div>
  );
};

export default Deposit;
