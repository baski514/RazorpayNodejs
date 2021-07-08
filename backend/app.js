const express = require('express')
const path = require('path')
const Razorpay = require('razorpay')
const shortid = require('shortid')
const cors = require("cors");

const app = express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const razorpay = new Razorpay({
	key_id: process.env.KEY_ID,
	key_secret: process.env.KEY_SECRET
})


const port = process.env.PORT || 8000;

app.get('/logo.svg',(req,res)=>{
    res.sendFile(path.join(__dirname,'logo.svg'))
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = 499
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log("Razorpay response "+JSON.stringify(response))
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log("Error From Razorpay "+JSON.stringify(error))
	}
})
//Starting a server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
});
