import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import * as moment from 'moment';

import {
  toBech32Address,
} from "@zilliqa-js/crypto";

import { BN } from "@zilliqa-js/util";

import { tokenAddress, tokenDecimals, snapshotPath, ZilSwap, tokenAddressBech } from './constants';
import { Contract } from '@zilliqa-js/contract';
import { bnOrZero, getTokenValue, toHumanNumber } from './util';

export const getBalancesMap = async (contract: Contract) => {
  let result: any;
  let contractBalanceState: any;
  result = await contract.getSubState("balances");
  contractBalanceState = result?.balances;
  if (!contractBalanceState) {
    // check for legacy balances map definition.
    result = await contract.getSubState("balances_map");
    contractBalanceState = result?.balances_map;
  }
  return contractBalanceState;
}

export const job = async () => {
  let zilswapBalances;
  try {
    console.log("fetch balances for token", tokenAddress);
    zilswapBalances = await getBalancesMap(ZilSwap);
  } catch (err) {
    console.error(err);
  }
  if (!zilswapBalances) return;
  let date = moment().format("YYYY-MM-DD");
  let lpJSON;
  try {
    lpJSON = readFileSync(snapshotPath).toString();
  } catch (e) {
    console.log("no state persisted yet");
    mkdirSync(`data/${tokenAddressBech}`, { recursive: true });
  }
  const state = lpJSON ? JSON.parse(lpJSON) : { raw: {}, formatted: {} };
  if (!state[date]) {
    console.log("append new entry for date", date);
    const balances = zilswapBalances[tokenAddress];
    state.raw[date] = balances;
    // state.formatted[date] = {};
    // for (const addr of Object.keys(balances)) {
    //   const balance = balances[addr];
    //   const bechAddress = toBech32Address(addr);
    //   // const bn = parseFloat(getTokenValue(tokenDecimals, balance).toFixed(5)) / 2;
    //   // const long = new Long(balance);
    //   // console.log({ bechAddress, balance, bn });
    //   state.formatted[date][bechAddress] = bn;
    // }
  }
  writeFileSync(snapshotPath, JSON.stringify(state, null, 2));
}