import { Zilliqa } from "@zilliqa-js/zilliqa";

const {
    fromBech32Address,
    toBech32Address,
} = require("@zilliqa-js/crypto");

export const zilliqa = new Zilliqa("https://api.zilliqa.com/");
export const zilSwapAddress = "0xBa11eB7bCc0a02e947ACF03Cc651Bfaf19C9EC00".toLowerCase();

export const tokenAddressBech = "zil12jhxfcsfyaylhrf9gu8lc82ddgvudu4tzvduum"; // OKI Token address
export const tokenDecimals = 5;
export const tokenAddress = fromBech32Address(tokenAddressBech).toLowerCase();
export const ZilSwap = zilliqa.contracts.at(zilSwapAddress);

export const snapshotPath = `data/${tokenAddressBech}/balances.json`;
export const sharesPath = `data/${tokenAddressBech}/shares.json`;
export const dataPath = `data/${tokenAddressBech}`;

export const lpBlockList = [
    tokenAddressBech,
    "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w",
    "zil1hcdtcj3xrzn2ucndleg5h4wn4h759hcrcxrld5",
].map(a => fromBech32Address(a).toLowerCase());

// TODO: get pool amount dynamically
const poolAmount = 20000;
export const interestEarned = 1;
export const rewardsToDistribute = poolAmount * interestEarned;
