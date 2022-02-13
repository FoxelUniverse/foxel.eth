import { Alert, Button, Col, Menu, Row, Affix, Typography } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import {
  HomeOutlined,
  BugOutlined,
  QuestionCircleOutlined,
  PlusCircleOutlined,
  DeploymentUnitOutlined,
  RocketOutlined,
  HeartOutlined,
  GithubOutlined,
  TwitterOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, Route, Switch, HashRouter, useLocation } from "react-router-dom";
import "./App.css";
import { Account, Contract, Faucet, ThemeSwitch, NetworkDisplay, FaucetHint } from "./components";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, Hints, Subgraph, ViewFoxel, Roadmap, MintView } from "./views";
import { useStaticJsonRPC } from "./hooks";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.mumbai; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS.matic;

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });
  const [minting, setMinting] = useState(false);

  // keep track of a variable from the contract in the local React state:

  const currentSupply = useContractReader(readContracts, "Foxel", "currentSupply");
  const tokenPrice = useContractReader(readContracts, "Foxel", "price", 30000);
  const tokenLimit = useContractReader(readContracts, "Foxel", "limit", 30000);
  const mintEnabled = useContractReader(readContracts, "Foxel", "mintEnabled");
  const baseUri = useContractReader(readContracts, "Foxel", "baseURI");

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Affix>
        <NetworkDisplay
          NETWORKCHECK={NETWORKCHECK}
          localChainId={localChainId}
          selectedChainId={selectedChainId}
          targetNetwork={targetNetwork}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
        />

        <Menu style={{ textAlign: "left" }} selectedKeys={[location.hash]} mode="horizontal">
          <Menu.Item
            icon={
              <HomeOutlined
                type="message"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              />
            }
            key="#/"
          >
            <a href="/#/">Home</a>
          </Menu.Item>
          <Menu.Item
            icon={
              <PlusCircleOutlined
                type="message"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              />
            }
            key="#/mint"
          >
            <a href="/#/mint">Mint</a>
          </Menu.Item>
          <Menu.Item
            icon={
              <RocketOutlined
                type="message"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              />
            }
            key="#/roadmap"
          >
            <a href="/#/roadmap">Roadmap</a>
          </Menu.Item>
          {/* <Menu.Item
            icon={
              <DeploymentUnitOutlined
                type="message"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              />
            }
            key="#/dao"
          >
            <a href="/#/dao">FoxelDAO</a>
          </Menu.Item>
          <Menu.Item
            icon={
              <HeartOutlined
                type="message"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              />
            }
            key="#/breed"
          >
            <a href="/#/breed">Breed</a>
          </Menu.Item> */}
          {DEBUG ? (
            <Menu.Item
              icon={
                <BugOutlined
                  type="message"
                  style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                  theme="outlined"
                />
              }
              key="#/debug"
            >
              <a href="/#/debug">Debug</a>
            </Menu.Item>
          ) : null}
          {DEBUG ? (
            <Menu.Item
              icon={
                <QuestionCircleOutlined
                  type="message"
                  style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                  theme="outlined"
                />
              }
              key="#/hints"
            >
              <a href="/#/hints">Hints</a>
            </Menu.Item>
          ) : null}
        </Menu>
        <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
          <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
            {USE_NETWORK_SELECTOR && (
              <div style={{ marginRight: 20 }}>
                {/* <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              /> */}
              </div>
            )}
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              tokenPrice={tokenPrice}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </div>
          {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
            <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
          )}
        </div>
      </Affix>
      <HashRouter>
        <Switch>
          <Route exact path="/">
            {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
            <Home
              yourLocalBalance={yourLocalBalance}
              writeContracts={writeContracts}
              readContracts={readContracts}
              tx={tx}
              localProvider={localProvider}
            />
          </Route>
          <Route path="/roadmap">
            {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
            <Roadmap
              yourLocalBalance={yourLocalBalance}
              writeContracts={writeContracts}
              readContracts={readContracts}
              tx={tx}
              localProvider={localProvider}
            />
          </Route>
          <Route path="/foxel/:id">
            {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
            <ViewFoxel baseUri={baseUri} />
          </Route>
          <Route path="/mint">
            <MintView
              address={address}
              loadWeb3Modal={loadWeb3Modal}
              price={price}
              yourLocalBalance={yourLocalBalance}
              tokenLimit={tokenLimit}
              tokenPrice={tokenPrice}
              mintEnabled={mintEnabled}
              currentSupply={currentSupply}
              minting={minting}
              writeContracts={writeContracts}
              setMinting={setMinting}
              tx={tx}
            />
          </Route>
          <Route path="/debug">
            <Contract
              name="Foxel"
              price={price}
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
          </Route>
          <Route path="/hints">
            <Hints
              address={address}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/subgraph">
            <Subgraph
              subgraphUri={props.subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
            />
          </Route>
        </Switch>
      </HashRouter>
      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ padding: 20, bottom: 0, width: "100%" }}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={4}>
            <a href="https://github.com/FoxelUniverse" target="_blank" rel="noopener noreferrer">
              <GithubOutlined
                title="Look at Source Code on GitHub"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              ></GithubOutlined>
            </a>
          </Col>
          <Col span={4}>
            <a href="https://twitter.com/FoxelUniverse?ref_src=twsrc%5Etfw" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined
                title="Follow Foxel on Twitter"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              ></TwitterOutlined>
            </a>
          </Col>
          <Col span={4}>
            <a
              href="https://polygonscan.com/address/0x35ba602c23d9f310fb2608f81c0c9e49c5136989"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileTextOutlined
                title="View the Contract on PolygonScan"
                style={{ paddingTop: 20, fontSize: "30px", color: "#d34d2f" }}
                theme="outlined"
              ></FileTextOutlined>
            </a>
          </Col>
        </Row>
      </div>
      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
