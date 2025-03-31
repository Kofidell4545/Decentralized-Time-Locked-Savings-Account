import { useState, useEffect } from "react";
import { getWallets, WalletProvider } from "@mysten/wallet-standard";

const ConnectWallet = ({ onWalletConnected }) => {
  const [wallets, setWallets] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const loadWallets = async () => {
      const availableWallets = await getWallets();
      setWallets(availableWallets);
    };
    loadWallets();
  }, []);

  const connectWallet = async () => {
    if (wallets.length > 0) {
      const selectedWallet = wallets[0]; // Auto-select first wallet
      setWallet(selectedWallet);
      onWalletConnected(selectedWallet);
    }
  };

  return (
    <div>
      {wallet ? (
        <p>Connected: {wallet.name}</p>
      ) : (
        <button onClick={connectWallet}>Connect Sui Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
