"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUuid = getUuid;

/* eslint-disable no-bitwise */
function mathRandomUuid() {
  let d = new Date().getTime();
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}
/* eslint-endable no-bitwise */


function cryptoUuid() {
  const cryptoLib = window.crypto || window.msCrypto;
  const buf = new Uint16Array(8);
  cryptoLib.getRandomValues(buf);

  const S4 = num => {
    let ret = num.toString(16);

    while (ret.length < 4) {
      ret = `0${ret}`;
    }

    return ret;
  };

  return S4(buf[0]) + S4(buf[1]) + S4(buf[2]) + S4(buf[3]) + S4(buf[4]) + S4(buf[5]) + S4(buf[6]) + S4(buf[7]);
}

function getUuid() {
  const cryptoLib = window.crypto || window.msCrypto;

  if (typeof cryptoLib !== 'undefined' && typeof cryptoLib.getRandomValues !== 'undefined' && typeof window.Uint16Array === 'undefined') {
    return cryptoUuid();
  }

  return mathRandomUuid();
}