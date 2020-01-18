import { call, put, takeEvery, all, take, select } from "redux-saga/effects";
import { create } from "apisauce";

import {
  getBalanceSuccess,
  getBalanceError,
  // postPaymentTransactionSuccess,
  // postPaymentTransactionError,
  // getListenToTransactionSuccess,
  // getListenToTransactionError,
  // connectToRippleApi,
  // connectToRippleApiSuccess,
  // connectToRippleApiError,
  getMarketDataSuccess,
  getMarketDataError,
  getMarketSevensSuccess,
  getMarketSevensError,
  createTrustlineSuccess,
  createTrustlineError,
  transferXrpSuccess,
  transferXrpError,
  getTransactionsSuccess,
  getTransactionsError,
  getTrustlinesSuccess,
  getTrustlinesError,
  addNewWallet,
} from "../actions";
import { createSevensObj, sologenic } from "../utils";

const api = create({
  baseURL: "https://api.coinfield.com/v1/",
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
  timeout: 10000,
});

const getMarketData = defaultCurrency =>
  api.get(`tickers/xrp${defaultCurrency}`);

function* requestGetMarketData(action) {
  try {
    const response = yield call(getMarketData, "usd");
    if (response.ok) {
      yield put(getMarketDataSuccess(response.data.markets[0]));
    } else {
      yield put(getMarketDataError(response.data));
    }
  } catch (error) {
    console.log(error);
  }
}

const mediatorApi = create({
  baseURL: "https://mediator.coinfield.com/",
  headers: {
    post: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
  timeout: 10000,
});

const getMarketSevens = () => mediatorApi.get("seven");

export function* requestMarketSevens() {
  const response = yield call(getMarketSevens);
  if (response.ok) {
    // convert sevens array into object with key value pairs where key = market id
    const sevensObj = yield createSevensObj(response.data);
    yield put(getMarketSevensSuccess(sevensObj));
  } else {
    // yield put(currenciesError());
  }
}

function* requestConnectToRippleApi() {
  try {
    yield sologenic.connect();

    yield sologenic.on("queued", (id, tx) => {
      console.log("TX QUEUED: ", id);
    });
    yield sologenic.on("dispatched", (id, tx) => {
      console.log("TX DISPATCHED:", id);
    });
    yield sologenic.on("requeued", (id, tx) => {
      console.log("TX requeued:", id);
    });
    yield sologenic.on("warning", (id, type, tx) => {
      console.log("TX WARNING:", id, type, tx);
    });
    yield sologenic.on("validated", (id, tx) => {
      console.log("TX VALIDATED:", id);
    });
    yield sologenic.on("failed", (id, type, tx) => {
      console.log("TX FAILED:", id, type, tx);
    });
    console.log("start");
  } catch (error) {
    // yield put(connectToRippleApiError());
    console.log("REQUEST_CONNECT_RIPPLE_API_ERROR", error);
  }
}

const getAccountInfo = address => {
  const rippleApi = sologenic.getRippleApi();
  return rippleApi.getAccountInfo(address);
};

const getBalances = address => {
  const rippleApi = sologenic.getRippleApi();
  return rippleApi.getBalances(address);
};

function* requestGetBalance(action) {
  try {
    const { id, address } = action;
    // const response = yield call(getAccountInfo, address);
    const response = yield call(getBalances, address);
    const xrpBalance = response.filter(item => item.currency === "XRP");
    if (response) {
      yield put(getBalanceSuccess(id, Number(xrpBalance[0].value)));
    } else {
      yield put(getBalanceError());
    }
  } catch (error) {
    console.log("REQUEST_GET_BALANCE_ERROR", error);
  }
}

const setAccount = (address, secret, keypair) => {
  return sologenic.setAccount({
    address,
    // secret: secret ? secret : "",
    keypair,
  });
};

const setTrustline = account => {
  const solo = "534F4C4F00000000000000000000000000000000";
  return sologenic.submit({
    TransactionType: "TrustSet",
    Account: account,
    LimitAmount: {
      currency: solo,
      issuer: "rEFgkRo5BTxXJiLVYMdEnQQ9J9Kj1F3Yvi", //this is a test issuer for solo which is generated by sologenic-issuarance
      value: "400000000",
    },
    Flags: 0x00020000,
  });
};

function* requestCreateTrustline(action) {
  const { address, secret, keypair, id } = action;
  try {
    yield call(setAccount, address, secret, keypair);
    const tx = yield call(setTrustline, address);
    console.log("tx", tx);
    const response = yield tx.promise;
    console.log(response);
    if (response) {
      yield put(createTrustlineSuccess(id));
    } else {
      yield put(createTrustlineError());
    }
  } catch (error) {
    yield put(createTrustlineError());
    console.log("REQUEST_CREATE_TRUSTLINE", error);
  }
}

const transferXrp = (account, destination, value) => {
  const valueAmount = value / 0.000001;

  return sologenic.submit({
    TransactionType: "Payment",
    Account: account,
    Destination: destination,
    Amount: `${valueAmount}`,
  });
};

function* requestTransferXrp(action) {
  try {
    const { account, keypair, destination, value } = action;
    const secret = keypair ? keypair : "";
    yield call(setAccount, account, secret, keypair);
    const tx = yield call(transferXrp, account, destination, value);
    console.log("tx", tx);
    const response = yield tx.promise;
    console.log(response);
    if (response) {
      yield put(transferXrpSuccess(response));
    }
  } catch (error) {
    console.log("REQUEST_TRANSFER_XRP_ERROR", error);
    yield put(transferXrpError());
  }
}

const getTransactions = async address => {
  const rippleApi = sologenic.getRippleApi();
  const currentLedger = await rippleApi.getLedgerVersion();
  console.log("currentLedger", currentLedger);
  return rippleApi.getTransactions(address, {
    minLedgerVersion: currentLedger - 500,
    maxLedgerVersion: currentLedger,
  });
};

function* requestGetTransactionsactions(action) {
  const { address } = action;
  try {
    const response = yield call(getTransactions, address);
    console.log("TRANSACTIONS");
    console.log(response);
    if (response) {
      yield put(getTransactionsSuccess(response));
    }
  } catch (error) {
    console.log("REQUEST_GET_TRANSACTIONS_ERROR", error);
    yield put(getTransactionsError());
  }
}

const getTrustlines = (address, issuer) => {
  const rippleApi = sologenic.getRippleApi();
  return rippleApi.getTrustlines(address, {
    counterparty: issuer,
  });
};

const issuer = "rEFgkRo5BTxXJiLVYMdEnQQ9J9Kj1F3Yvi"; //this is a test issuer for solo which is generated by sologenic-issuarance

function* requestGetTrustlines(action) {
  const {
    walletAddress,
    rippleClassicAddress,
    nickname,
    mnemonic,
    details,
  } = action;
  try {
    const response = yield call(getTrustlines, walletAddress, issuer);
    const trustline = response.length > 0 ? true : false;
    yield put(
      addNewWallet(
        {
          mnemonic,
          wallet: details,
        },
        nickname ? nickname : "",
        walletAddress,
        rippleClassicAddress,
        trustline,
      ),
    );
  } catch (error) {
    console.log("REQUEST_GET_TRUSTLINES_ERROR", error);
    yield put(getTrustlinesError());
  }
}

// const preparePayment = (address, payment) => {
//   return rippleLibApi.preparePayment(address, payment);
// };

// const sign = (txJSON, secret) => {
//   return rippleLibApi.sign(txJSON, secret);
// };

// const submit = signedTransaction => {
//   return rippleLibApi.submit(signedTransaction);
// };

// function* requestPostPaymentTransaction(action) {
//   yield rippleLibApi.connect();
//   try {
//     const { address, destinationAddress, amountValue, secret } = action;

//     const payment = {
//       source: {
//         address: address,
//         maxAmount: {
//           value: amountValue,
//           currency: "XRP"
//         }
//       },
//       destination: {
//         address: destinationAddress,
//         amount: {
//           value: amountValue,
//           currency: "XRP"
//         }
//       }
//     };

//     const prepared = yield call(preparePayment, address, payment);
//     console.log("prepared", prepared);
//     try {
//       const responseSign = yield call(sign, prepared.txJSON, secret);
//       console.log("sign", responseSign);
//       try {
//         const { signedTransaction } = responseSign;
//         const responseSubmit = yield call(submit, signedTransaction);
//         console.log("submit", responseSubmit);
//         try {
//           yield put(postPaymentTransactionSuccess(responseSubmit));
//           // yield rippleLibApi.disconnect();
//           // console.log("done and disconnected.");
//         } catch (error) {
//           console.log("Put postpostPaymentTransaction failed.", error);
//           yield put(postPaymentTransactionError(error));
//         }
//       } catch (error) {
//         console.log("submit failed", error);
//       }
//     } catch (error) {
//       console.log("sign failed", error);
//     }
//   } catch (error) {
//     console.log("REQUEST_PAYMENT_PREPARE_ERROR", error);
//   }
// }

// const requestSubscribe = account => {
//   return rippleLibApi.request("subscribe", {
//     accounts: [account]
//   });
// };

// const requestUnsubscribe = account => {
//   return rippleLibApi.request("unsubscribe", {
//     accounts: [account]
//   });
// };

// function* requestListenToTransaction(action) {
//   yield rippleLibApi.connect();
//   const { account } = action;
//   try {
//     yield rippleLibApi.connection.on("transaction", event => {
//       console.log(
//         JSON.stringify(event, null, 2),
//         "------------------------------"
//       );

//       return rippleLibApi
//         .request("unsubscribe", {
//           accounts: [account]
//         })
//         .then(response => {
//           console.log("Successfully unsubscribed", response);
//           rippleLibApi.disconnect();
//         })
//         .catch(error => {
//           console.log("unsubscription error", error);
//         });
//     });
//     try {
//       const response = yield call(requestSubscribe, account);
//       try {
//         console.log(
//           "Listen to transactions",
//           JSON.stringify(response, null, 2)
//         );
//         // if (response.status) {
//         yield put(getListenToTransactionSuccess(response));
//         console.log("Successfully subscribed");

//         // yield rippleLibApi.disconnect();
//         // console.log("done and disconnected.");
//         // }
//       } catch (error) {
//         console.log("Put getListenToTransactionSuccess failed.", error);
//         yield put(getListenToTransactionError(error));
//       }
//     } catch (error) {
//       console.log("subscribed failed.", error);
//     }
//   } catch (error) {
//     console.log("REQUEST_LISTEN_TO_TRANSACTION", error);
//   }
// }

export default function* rootSaga() {
  yield all([
    takeEvery("GET_MARKET_DATA", requestGetMarketData),
    takeEvery("GET_MARKET_SEVENS", requestMarketSevens),
    takeEvery("GET_BALANCE", requestGetBalance),
    takeEvery("CONNECT_TO_RIPPLE_API", requestConnectToRippleApi),
    takeEvery("CREATE_TRUSTLINE", requestCreateTrustline),
    takeEvery("TRANSFER_XRP", requestTransferXrp),
    takeEvery("GET_TRANSACTIONS", requestGetTransactionsactions),
    takeEvery("GET_TRUSTLINES", requestGetTrustlines),
    // takeEvery("POST_PAYMENT_TRANSACTION", requestPostPaymentTransaction),
    // takeEvery("GET_LISTEN_TO_TRANSACTION", requestListenToTransaction),
  ]);
}
