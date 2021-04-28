const {
    toBech32Address,
} = require("@zilliqa-js/crypto");

import { readFileSync, writeFileSync } from 'fs';

import {
    snapshotPath,
    sharesPath,
    lpBlockList,
    rewardsToDistribute,
    csvPath,
    tokenDecimals,
    interestEarned,
} from './constants';

export const job = () => {
    const { raw, formated } = JSON.parse(readFileSync(snapshotPath).toString());
    const state = raw;
    const dates: string[] = Object.keys(state);
    const allAccounts: any = [];
    const aggregatedState: { [x: string]: number } = {};
    const aggregatedShares: { [x: string]: number } = {};

    const nSnapshots = dates.length;

    for (var i = 0; i < nSnapshots; i++) {
        let accounts = Object.keys(state[dates[i]]);
        for (var j = 0; j < accounts.length; j++) {
            const contribution = parseFloat(state[dates[i]][accounts[j]]);
            if (!allAccounts.includes(accounts[j])) {
                allAccounts.push(accounts[j]);
                aggregatedState[accounts[j]] = contribution
            } else {
                aggregatedState[accounts[j]] = aggregatedState[accounts[j]] + contribution;
            };
        };
    };

    const totalContribution = allAccounts.reduce((memo: number, account: string) => {
        const contribution = aggregatedState[account];
        return lpBlockList.indexOf(account) === -1 ? memo + contribution : memo;
    }, 0);

    for (var i = 0; i < allAccounts.length; i++) {
        const account = allAccounts[i]
        if (lpBlockList.indexOf(account) === -1) {
            const share = aggregatedState[account] / totalContribution;
            aggregatedShares[account] = share;
        };
    };

    const totalShare = Object.values(aggregatedShares).reduce((m, s) => m + s, 0);
    if (totalShare !== 1) throw new Error("totalShare !== 1");
    // const totalInterest = totalContribution * interestEarned;
    // const adjustedInterest = totalInterest / nSnapshots;
    // console.log({ totalShare, totalContribution, adjustedInterest });
    const lpRank = Object.keys(aggregatedShares).map((address) => {
        const share = aggregatedShares[address];
        const currentBalance = state[dates[dates.length - 1]][address];
        const account = toBech32Address(address);
        const rewards = share * rewardsToDistribute;
        const lp = {
            account,
            currentBalance,
            share,
            rewards
        };
        return lp;
    }).filter(e => (e.rewards > 0)).sort((a, b) => b.share - a.share);

    const jsonArray = JSON.stringify(lpRank, null, 2);
    writeFileSync(sharesPath, jsonArray);
    writeFileSync(csvPath, `Address,Weighted Share,Rewards / Interest @ ${interestEarned * 100}%\n${lpRank.map(printLP).join('\n')}`);
}

const printLP = (lp: any) => `${lp.account},${lp.share.toFixed(3)},${lp.rewards.toFixed(tokenDecimals)}`;