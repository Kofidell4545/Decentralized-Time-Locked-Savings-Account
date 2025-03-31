import { useState } from "react";
import { JsonRpcProvider, TransactionBlock } from "@mysten/sui.js/client";

const SUI_RPC = "https://fullnode.testnet.sui.io";

const Withdraw = ({ wallet }) => {
  const [txHash, setTxHash] = useState(null);

  const withdrawFunds = async () => {
    if (!wallet) return;

    const provider = new JsonRpcProvider(SUI_RPC);
    const tx = new TransactionBlock();

    tx.moveCall({
      target: "YOUR_PACKAGE::TimeLockSavings::withdraw",
      arguments: [],
    });

    const response = await wallet.signAndSubmitTransactionBlock({
      transactionBlock: tx,
    });
    setTxHash(response.digest);
  };

  return (
    <div>
      <h2>Withdraw Funds</h2>
      <button onClick={withdrawFunds}>Withdraw</button>
      {txHash && <p>Transaction: {txHash}</p>}
    </div>
  );
};

export default Withdraw;
