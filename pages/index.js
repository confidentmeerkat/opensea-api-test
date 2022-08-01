import { Button, Divider, Typography } from "@mui/material";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
import { useRef, useState } from "react";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import usdcABI from "../helpers/usdcABI.json";
import { Box } from "@mui/system";
import Container from "../components/container";
import Link from "next/link";

const getProviderOptions = () => {
  const infuraId = process.env.REACT_APP_INFURA_ID;
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "Web3Modal Example App",
        infuraId,
      },
    },
  };
  return providerOptions;
};

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

export default function Home() {
  let web3Modal = useRef(null);

  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState({ chainId: "", networkId: "" });
  const [balances, setBalances] = useState({ eth: 0, usdc: 0 });

  async function handleConnect() {
    web3Modal = new Web3Modal({
      network: 1,
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });

    const provider = await web3Modal.connect();
    await subscribeProvider(provider);

    await provider.enable();
    const web3 = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];

    const USDContractInstance = await new web3.eth.Contract(
      usdcABI,
      "0x0882477e7895bdC5cea7cB1552ed914aB157Fe56" // USDC proxy cotract address
    );

    const eth = await web3.eth.getBalance(address);
    const usdc = await USDContractInstance.methods.balanceOf(address).call();
    setBalances({ eth, usdc });
    setAddress(address);
  }

  async function subscribeProvider(provider) {
    if (!provider.on) return;

    provider.on("close", () => resetApp());
    provider.on("accountChanged", async (accounts) => setAddress(accounts[0]));
    provider.on("chainChanged", async (chainId) => {
      const networkId = await web3.eth.net.getId();
      setNetwork({ chainId, networkId });
    });
    provider.on("networkChanged", async (networkId) => {
      const chainId = await web3.eth.chainId();
      setNetwork({ chainId, networkId });
    });
  }

  async function resetApp() {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    setWeb3(null);
    setAddress("");
  }

  return (
    <Container>
      {!address && (
        <Box my={2}>
          <Button
            sx={{
              "&:hover": {
                color: "white",
                backgroundColor: "primary.main",
              },
            }}
            variant="outlined"
            fullWidth
            onClick={handleConnect}
          >
            Connect to Wallet
          </Button>
        </Box>
      )}

      {!!address && (
        <Box my={2} display="flex" flexDirection="column" alignItems="center">
          <div className="flex flex-row justify-end w-full">
            <Link href="/nfts">
              <a className="flex py-2 px-4 text-blue-500">Search For NFTs</a>
            </Link>
          </div>
          <Typography
            variant="h4"
            className="text-blue-600 py-4 justify-self-center"
          >
            My Wallet
          </Typography>

          <hr className="w-full" />

          <div className="flex flex-col items-center my-4">
            <h6 className="text-xl font-bold">Account Address</h6>
            <i>{address}</i>
          </div>

          <hr className="w-full" />

          <div className="flex flex-col items-center my-4">
            <h6 className="text-xl font-bold">Wallet Balance</h6>
            <div className="my-2 flex flex-row items-center space-x-2">
              <img
                src="/usd-coin-usdc-logo.svg"
                className="w-4 h-4 rounded-full ring-1"
              />
              <span>
                {balances.usdc} <strong>USDC</strong>
              </span>
              <img
                src="/ethereum-eth-logo.svg"
                className="w-4 h-4 rounded-full ring-1"
              />
              <span>
                {balances.eth} <strong>ETH</strong>
              </span>
            </div>
          </div>
        </Box>
      )}
    </Container>
  );
}
