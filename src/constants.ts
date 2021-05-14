import { Zilliqa } from "@zilliqa-js/zilliqa";

const {
    fromBech32Address,
    toBech32Address,
} = require("@zilliqa-js/crypto");

export const zilliqa = new Zilliqa("https://api.zilliqa.com/");
export const zilSwapAddress = "0xBa11eB7bCc0a02e947ACF03Cc651Bfaf19C9EC00".toLowerCase();
export const tokenAddressBech = "zil1lq3ghn3yaqk0w7fqtszv53hejunpyfyh3rx9gc";
// export const tokenAddressBech = "zil1w5hwupgc9rxyuyd742g2c9annwahugrx80fw9h";
export const tokenDecimals = 3;
export const tokenAddress = fromBech32Address(tokenAddressBech).toLowerCase();
export const ZilSwap = zilliqa.contracts.at(zilSwapAddress);

export const snapshotPath = `data/${tokenAddressBech}/balances.json`;
export const sharesPath = `data/${tokenAddressBech}/shares.json`;
export const dataPath =  `data/${tokenAddressBech}`;

export const lpBlockList = [
    tokenAddressBech,
    "zil1hgg7k77vpgpwj3av7q7vv5dl4uvunmqqjzpv2w",
    "zil1jgr575w69us9u5u0h8jt2wz0dhcdf4qwp574pd"
].map(a => fromBech32Address(a).toLowerCase());

// TODO: get pool amount dynamically
const poolAmount = 179.39;
export const interestEarned = .1;
export const rewardsToDistribute = poolAmount * interestEarned;