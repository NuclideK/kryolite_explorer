const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

async function getWallet() {
    return new Promise(async (resolve, reject) => {
        let wallet = params.wallet
        if (wallet === null || wallet.length < 1) {
            wallet = prompt("Wallet address?")
        }
        resolve(wallet)
    })
}

async function renderWalletTransactions() {
    let wallet = await getWallet()
    let transactions = {}
    await fetchContent(`/ledger/${wallet}/transactions`)
    .then(async transactions_raw => {
        try {
            transactions = JSON.parse(transactions_raw)
            if (transactions.title && transactions.title === "Bad Request") throw("Invalid address")
        } catch {
            alert("Invalid address")
            window.history.back()
        }
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            if (i % 100 === 0) {await delay(1)}
            createNode(
                transaction.id,
                transaction.transactionType,
                transaction.value,
                transaction.nonce,
                transaction.from,
                bufferToWallet(transaction.to.buffer),
                bufferToString(transaction.hash.buffer)
            )
            if (i >= 1000) {
                alert("Currently you can only load up to a thousand transactions, this will be changed in a future update :)")
                break;
            }
        }
    })
    .catch(error => {console.error(error)})
}

let owo = "";
function showOrHide(id) {
    try {
        let hideable = document.getElementById(id).querySelector(".hideable");
        if (hideable.classList.contains("show")) {
            hideable.classList.remove("show")
        } else {
            hideable.classList.add("show")
        }
    } catch {}
}

function createNode(id,type,value,nonce,from,to,hash) {
    let body = `
    <div class = "transaction" id = "{id}">
    <h1 onClick='showOrHide("{id}")'>ID: {id}</h1>
    <div class = "hideable">
        <p>Type: {type}</p>
        <p>Value: {value}</p>
        <p>Nonce: {nonce}</p>
        <p>From: {from}</p>
        <p>To: {to}</p>
        <p>Hash: {hash}</p>
        </div>
    </div>
    `
    .replaceAll("{id}",id)
    .replaceAll("{type}",type)
    .replaceAll("{value}",value)
    .replaceAll("{nonce}",nonce)
    .replaceAll("{from}",from)
    .replaceAll("{to}",to)
    .replaceAll("{hash}",hash);
    document.querySelector("#main").innerHTML += body
}


renderWalletTransactions()