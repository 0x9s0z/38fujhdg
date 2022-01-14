import "./page.scss"
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchData} from "./redux/data/dataActions.js";
import {connect} from "./redux/blockchain/blockchainActions.js";
import * as s from "./styles/globalStyles.js";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export default function Page() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
    dispatch(connect());
    getData();
  }, []);


  useEffect(() => {
    getData();
  }, [blockchain.account]);

  function switchConnect() {
    window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        "chainId": "0x4", // 16 in decimal
        "chainName": "Rinkeby Testnet Network",
        "rpcUrls": [
          "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
        ],
        "nativeCurrency": {
          "name": CONFIG.NETWORK.NAME,
          "symbol": CONFIG.NETWORK.SYMBOL,
          "decimals": CONFIG.NETWORK.ID
        },
        "blockExplorerUrls": [
          "https://rinkeby.etherscan.io"
        ]
      }]
    }).then(async () => {
      await dispatch(connect());
      getData();
    })
  }

  return (
    <div id="center">
      <div className="header">
      {/*  <img className="logo" alt={"logo"} src={"/config/images/logo.png"}/>*/}
        <div className="title">{CONFIG.NFT_NAME}</div>
      </div>
      <div id="content">
        <h3>ABOUT RunForrest NFT</h3>
        <p>Inspired by one of the greatest Academy Award winning film Forrest Gump, 
            RunforrestNFT is a collection of 7777 uniquely-designed NFTs exploring the Metaverse..</p>
        <p>
          <img src="/banner.png" alt=""/>
        </p>
        <h3>Why RunForrest NFT ?</h3>
        <p>With the global economy hit by Covid-19 related disruptions, lockdown was part of our life during the past 2 years.
        If you have seen one of the greatest Academy Award winning film Forrest Gump starring Tom Hanks, you would know that Forrest Gump reached the peak of his life by keep running.
        Run Forrest! Building up RunforrestNFT world is to remind people to put the past behind and move on.
        Our Mission is to be one of the most successful NFT projects and we will share our love and hope with you..</p>
        <p>
          <img src="/banner2.png" alt=""/>
        </p>
        <h3>Provenance</h3>
        <p>Run Forrest! Building up RunforrestNFT world is to remind people to put the past behind and keep running.
        Our Mission is to be one of the most successful NFT projects and we will share our love and hope with you..</p>
        <p>
          <img src="/banner3.jpg" alt=""/>
        </p>
        <h3>Pricing</h3>
        <h4>Minting Price: 0.01ETH</h4>
        <h3>Related Links:</h3>
        <p>
          Twitter:
          <a style={{marginLeft: 20}} href="https://twitter.com/runforrestNFT" target="_blank">
          @RunForrestNFT
          </a>
        </p>
        <p>
          Discord:
          <a style={{marginLeft: 20}} href="https://discord.gg/d3cmwtJncM" target="_blank">
          https://discord.gg/d3cmwtJncM
          </a>
        </p>
        <p>
          Contract:
          <a style={{marginLeft: 20}} href={CONFIG.SCAN_LINK}>
            {truncate(CONFIG.CONTRACT_ADDRESS, 100)}
          </a>
        </p>
        <div className="sticky-cta">
          <div className="sticky-cta-inner">
            <div>
              <div className="sticky-container">
                <div style={{width:"200px", height: "auto"}} className="sticky-gif-container">
                  <img src="/minting_go.png" alt="Sample RunForrest"/>
                </div>
                <div className="sticky-content-container">
                  {/*<p><b>Your Wallet:</b> <a href={CONFIG.SCAN_LINK}>{truncate(CONFIG.CONTRACT_ADDRESS, 15)}</a></p>*/}
                  <p>
                    <a className="mr-3" href="#">MINTING</a>
                    <a href={CONFIG.MARKETPLACE_LINK} target="_blank">{CONFIG.MARKETPLACE}</a>
                  </p>
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <p>The sale has ended.</p>
                      <p>You can still
                        find {CONFIG.NFT_NAME} on</p>
                      <p>
                        <a target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>{CONFIG.MARKETPLACE}</a>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                        {CONFIG.NETWORK.SYMBOL}.
                      </p>
                      <p>
                        Excluding gas fees.
                      </p>
                      {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                        <>
                          {blockchain.errorMsg !== "" ? (
                              <p>
                                {blockchain.errorMsg}
                                <button onClick={switchConnect} className="cta-button">
                                  SWITCH NETWORK
                                </button>
                              </p>
                            ) :
                            <p>
                              Connect to the {CONFIG.NETWORK.NAME} network
                              <button
                                className="cta-button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(connect());
                                  getData();
                                }}
                              >
                                CONNECT
                              </button>
                            </p>
                          }
                        </>
                      ) : (
                        <>
                          <p><b>Your Wallet</b>{blockchain.account}</p>
                          <p>
                            <b>Number</b>{data.totalSupply} / {CONFIG.MAX_SUPPLY}
                          </p>
                          <p>{feedback}</p>
                          <p>
                            <button style={{lineHeight: 0.4, marginLeft: 0}}
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      decrementMintAmount();
                                    }}
                                    className="big-btn">
                              -
                            </button>
                            <span style={{margin: "0 20px"}}>{mintAmount}</span>
                            <button style={{lineHeight: 0.4}}
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      incrementMintAmount();
                                    }}
                                    className="big-btn">
                              +
                            </button>

                            <button
                              className="big-btn"
                              style={{marginLeft: 20}}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {claimingNft ? "BUSY" : "MINTING NOW"}
                            </button>
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer>
        <h3>FAQ</h3>
        <h4>Buying NFT for the first time, how can I get started?</h4>
          <p>
          <a className="mr-3" href="https://d1kjtx52rxv2sn.cloudfront.net/website/pdf/How+to+Install+and+Use+Metamask+on+Google+Chrome.pdf" target="_blank">Get a MetaMask chrome extension. </a>
          Load it with ETH through services that allow you to change your money to ETH like OKex/Binance or PayPal.
          Finally, <a className="mr-3" href="https://d1kjtx52rxv2sn.cloudfront.net/website/pdf/How+to+Install+and+Use+Metamask+on+Google+Chrome.pdf" target="_blank">click the button on the Sticky banner and approve the transaction on MetaMask!</a>
          </p>

          <h4>How can I trade my RunForrest NFT?</h4>
          <p>
          RunForrest NFT adhere to the ERC-721 standard so that you can trade them on platforms like OpenSea.  </p>

          <h4>What can I do with my RunForrest NFT?</h4>
          <p>
          You own your RunForrest NFT digitally and are free to do anything with them. 
         </p>
          <h4>My RunForrest NFT are not revealed yet on OpenSea. What can I do?</h4>
          <p>
          You need to click ‘sell’ on open sea to get your NFT listed. Then you will get the attention from the whole market..          
          </p>
          ©2022, RunForrest.io
        </footer>
      </div>
    </div>
  )
}