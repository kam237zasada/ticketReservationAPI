export class PaymentGateway {
    charge (amount: number, token: string, currency = "EUR") {
        return new Promise ((resolve, reject) => {
            switch (token) {
                case "card_error":
                    return reject(new Error("Your card has been declined."));
                case "payment error":
                    return reject (new Error("Something went wrong with your transaction."));
            default:
                resolve({amount, currency});
            }
        })
    }
}