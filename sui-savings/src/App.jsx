import { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";

function App() {
  const [wallet, setWallet] = useState(null);

  // Debugging - Check if app is mounting
  useEffect(() => {
    console.log("App Loaded");
  }, []);

  console.log("Rendering App Component");

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>Sui Time-Locked Savings</h1>
      <ConnectWallet onWalletConnected={setWallet} />

      {wallet ? (
        <>
          <Deposit wallet={wallet} />
          <Withdraw wallet={wallet} />
        </>
      ) : (
        <p>Please connect your wallet to proceed.</p>
      )}
    </div>
  );
}

export default App;
