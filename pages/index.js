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

  console.log(balances);

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
          <Button variant="contained" fullWidth onClick={handleConnect}>
            Connect to Wallet
          </Button>
        </Box>
      )}

      {!!address && (
        <Box my={2} display="flex" flexDirection="column">
          <Typography mt={2} variant="h4">My Wallet</Typography>
          <Divider />
          <Typography mt={2}>Account Address: {address}</Typography>
          <Typography mt={2}>
            Balance: {balances.eth + " ETH, " + balances.usdc + " USDC"}
          </Typography>
          <Divider />

          <Box color="primary" mt={4} display="flex" flexDirection="row" justifyContent="flex-end">
            <Link href="/nfts">
              <a>Search for NFTs</a>
            </Link>
          </Box>
        </Box>
      )}
    </Container>
  );
}
