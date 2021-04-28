import { job as getBalances } from './balances';
import { job as getLpStatus } from './shares';

getBalances().then(r => {
    getLpStatus();
})