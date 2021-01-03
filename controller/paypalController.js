var paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:"AWD3vJgtD8-_YnUhWLXyY3EUQqkARGcBNifpErBuayw_Chdy-E8xnzmacOrh6Fp4O6KZ2-0YT7MGUkuh",
  client_secret:"ENNplCdhtUvipBLO48ZltPp2OzExGedLe3G-oY8M6d6O73tgqqlolso2xIK1TcY_Z-a-Fdmn7Ossziyh",
});

module.exports.Payment = async (req, res) => {
  var order = await CreateOrder(req);
  paypal.payment.create(order, (error, payment) => {
    for(let i = 0;i < payment.links.length;i++)
    {
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
    }
  })
};

function CreateOrder(req) {
  return new Promise((resolve, reject) => {
    var totalCost = parseFloat(req.cookies.data.TotalCost) / 23080;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/paymentSuccess",
        cancel_url: "http://localhost:3000/",
      },
      transactions: [
        {
          item_list: {
            items: [{
                "name": "Train ticket",
                "currency": "USD",
                "price" : parseInt(totalCost).toString(),
                "quantity": 1,
                "sku": "001"
            }],
          },
          amount: {
            currency: "USD",
            total: parseInt(totalCost).toString(),
          },
          description: "Thanh toán tiền vé tàu",
        },
      ],
    };
    resolve(create_payment_json);
  });
}
