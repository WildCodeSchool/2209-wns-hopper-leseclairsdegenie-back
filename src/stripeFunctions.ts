import Stripe from "stripe"

const stripeClient = new Stripe(
    "sk_test_51NBJpJHYnCsITcxUkGTn6lrgqB0Tar8iJKQINB3sXDAVEEYakzUBHzNA3l3ARdqv0B6OrTyA5bwAH08PYWiSAI0n00Jydu32eA",
    {apiVersion: '2022-11-15'},
)


const stripePayement = async (amount, description) => {
    try {
        const payement = await stripeClient.paymentIntents.create(
            {
                amount: amount * 100,
                currency: "EUR",
                confirm: true,
                payment_method: 'pm_card_visa',
                description: description
            }
        )
        console.log("Le payement est réussi = ", payement);
        return payement.client_secret
    } catch (err) {
        console.log("Le payement a échoué = ", err);
        return err
    }
}
export default stripePayement