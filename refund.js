//company ID: 484929849
//customer ID: 573839293

const axios = require('axios');

async function getWallet(walletId) {
    try {
        const response = await axios.post("https://api.okra.ng/v2/mock-api/fetch-wallet", {
            id: walletId
        })

        if (response.status === "success") {
            return response.data.data
        }
        return response.data
    } catch(error) {
        throw error.response.data.message
    }
}

async function transfer(from, to, amount) {
    try {
        const response = await axios.post("https://api.okra.ng/v2/mock-api/pay", {
            from_id: from, 
            to_id: to, 
            amount
        })

        return response.data
    } catch(error) {
        throw error.response.data.message
    }
}

async function refundCustomer(company, user, amount) {
    try {
      const companyWallet = await getWallet(company)

      if (companyWallet.status !== "success") {
        throw new Error("Company wallet not found")
      }

      let customerWallet = await getWallet(user)

      if (customerWallet.status !== "success") {
        throw new Error("Customer wallet not found")
      }
      console.log("Customer Balance: " + customerWallet.data.wallet.amount)

      if (companyWallet.data.wallet.amount < amount) {
          throw new Error("Insufficient balance")
      }

      const response = await transfer(company, user, amount)

      console.log("Customer Balance: " + response.data.wallets.to.amount)

      return response.data
    } catch(error) {
        throw error
    }
}
  

(async function() {
    try {
    console.log(await refundCustomer('484929849', '573839293', 2003.0))
    } catch(error) {
        console.log(error)
    }
})()
