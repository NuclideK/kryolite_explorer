// https://gist.github.com/diafygi/90a3e80ca1c2793220e5/
var to_b58 = function (B, A) {
  var d = [],
    s = "",
    i,
    j,
    c,
    n;
  for (i in B) {
    (j = 0), (c = B[i]);
    s += c || s.length ^ i ? "" : 1;
    while (j in d || c) {
      n = d[j];
      n = n ? n * 256 + c : c;
      c = (n / 58) | 0;
      d[j] = n % 58;
      j++;
    }
  }
  while (j--) s += A[d[j]];
  return s;
};
var from_b58 = function (S, A) {
  var d = [],
    b = [],
    i,
    j,
    c,
    n;
  for (i in S) {
    (j = 0), (c = A.indexOf(S[i]));
    if (c < 0) return undefined;
    c || b.length ^ i ? i : b.push(0);
    while (j in d || c) {
      n = d[j];
      n = n ? n * 58 + c : c;
      c = n >> 8;
      d[j] = n % 256;
      j++;
    }
  }
  while (j--) b.push(d[j]);
  return new Uint8Array(b);
};

function Base64ToUint8Array(base64) {
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function bufferToWallet(base64) {
  return "kryo:" + bufferToString(base64);
}
function bufferToString(base64) {
  var MAP = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  var int8array = Base64ToUint8Array(base64);
  var encoded = to_b58(int8array, MAP);
  return encoded;
}

async function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

async function fetchContent(path) {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i] + path;
      try {
        await fetch(url)
          .then((response) => response.text())
          .then((text) => resolve(text));
      } catch {
        console.error(`Failed to fetch from ${url}`);
        if (i === urls.length - 1) reject("None of the URL's gave a response");
        continue;
      }
      break;
    }
  });
}

function UnixToDateStr(unix_timestamp) {
  let date = new Date(unix_timestamp * 1000);
  let dateStr = date.toLocaleString().split(" ");

  dateStr[1] = dateStr[1].replaceAll(".", ":");
  return `${dateStr[0]} ${dateStr[1]}`;
}

let urls = [
  "https://testnet-1.kryolite.io",
  "https://testnet-2.kryolite.io",
  "https://testnet-3.kryolite.io",
];
