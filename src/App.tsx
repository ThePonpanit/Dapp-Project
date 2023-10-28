import { secretABI, tokenABI, NFTABI } from "./abi";
import {
  MY_ACCOUNT_ADDRESS,
  SECRET_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_SYMBOL,
  NFT_CONTRACT_ADDRESS,
} from "./env";
import { formatUnits } from "viem";
import { useContractRead, useBalance } from "wagmi";
import { useState } from "react";
import "./App.css";

const urlMyAccount = `https://sepolia.etherscan.io/address/${MY_ACCOUNT_ADDRESS}`;
const urlSecret = `https://sepolia.etherscan.io/address/${SECRET_CONTRACT_ADDRESS}`;
const urlToken = `https://sepolia.etherscan.io/address/${TOKEN_CONTRACT_ADDRESS}`;
const urlNFT = `https://sepolia.etherscan.io/address/${NFT_CONTRACT_ADDRESS}`;
const metamaskAddress = MY_ACCOUNT_ADDRESS;
const urlMetamaskAddress = `https://sepolia.etherscan.io/address/${metamaskAddress}`;

function App() {
  const [NFTimage, setNFTImage] = useState<string>("");

  const useBal = useBalance({
    address: MY_ACCOUNT_ADDRESS,
  });

  const useReadSecret = useContractRead({
    address: SECRET_CONTRACT_ADDRESS,
    abi: secretABI,
    functionName: "secret",
  });

  const useReadTokenBalance = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: "balanceOf",
    args: [MY_ACCOUNT_ADDRESS],
  });

  const useReadTokentotalSupply = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenABI,
    functionName: "totalSupply",
  });

  const userReadNFT = useContractRead({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFTABI,
    functionName: "tokenURI",
    args: [0n],
    select: (uri) => {
      fetch(uri)
        .then((res) => res.json())
        .then((data) => {
          setNFTImage(data.image);
        });
    },
  });

  const displayBalance = useBal.isLoading
    ? "...loading balance..."
    : `${parseFloat(useBal.data?.formatted || "0").toFixed(2)} (SepoliaETH)`;
  const displaySecret = useReadSecret.isLoading
    ? "...loading secret..."
    : useReadSecret.data || "";
  const displayToken = useReadTokenBalance.isLoading
    ? "...loading token balance..."
    : `${parseFloat(formatUnits(useReadTokenBalance.data || 0n, 18)).toFixed(
        2
      )} ${TOKEN_SYMBOL}`;

  const displayTotalSupply = useReadTokentotalSupply.isLoading
    ? "...loading total supply..."
    : `${parseFloat(
        formatUnits(useReadTokentotalSupply.data || 0n, 18)
      ).toFixed(2)} ${TOKEN_SYMBOL}`;

  return (
    <>
      <h1>My Blockchain Assets</h1>
      <h1 style={{ fontSize: "2vh" }}>
        Meta Mask address:{" "}
        <a href={urlMetamaskAddress} target="_blank" rel="noopener noreferrer">
          {metamaskAddress}
        </a>
      </h1>

      <div className="info-div">
        <h2>💸 My account balance 💸</h2>
        <div className="data-display">{displayBalance}</div>
        <a href={urlMyAccount} target="_blank" rel="noopener noreferrer">
          Link
        </a>
        <hr />
      </div>

      <div className="info-div">
        <h2>💌 My secret love letter 💌</h2>
        <div className="data-display">{displaySecret}</div>
        <a href={urlSecret} target="_blank" rel="noopener noreferrer">
          Link
        </a>
        <hr />
      </div>

      <div className="info-div">
        <h2>🪙 My Token 🪙</h2>
        <div className="data-display">{displayToken}</div>
        <h3>💰 Total Supply of PYC Token 💰</h3>
        <div className="data-display">{displayTotalSupply}</div>
        <a
          href={urlToken}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "30px" }}
        >
          Link
        </a>

        <hr />
      </div>

      <div className="info-div">
        <h2>⚡ My NFT ⚡</h2>
        <div>
          {userReadNFT.isLoading || !NFTimage ? (
            "...loading NFT..."
          ) : (
            <img src={NFTimage} style={{ maxHeight: "35vh" }} />
          )}
        </div>
        <a href={urlNFT} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      </div>
    </>
  );
}

export default App;
