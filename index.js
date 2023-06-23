const express = require('express');
const port1=process.env.PORT||5000;
const app = express();
const bodyParser = require('body-parser');
const blockchain = require('./blockchain');
const sha256 = require('sha256');
const crypto = require('crypto'); 
const handlebars = require('handlebars');
let data=[];
let name="";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let users ={"admin":'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',"charith":'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'};
let balance={"admin":10000,"charith":10000};
const source = `
<!DOCTYPE html>
<html>
<head>
	<title>BlockChain Ledger</title>
	<style>
		body {
			background-color: #f2f2f2;
			font-family: Arial, sans-serif;
		}
		h1 {
			text-align: center;
			font-size: 3em;
			color: #4285f4;
			margin-top: 50px;
		}
		.container {
			max-width: 800px;
			margin: 50px auto;
			padding: 20px;
			background-color: #fff;
			box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
			border-radius: 10px;
			text-align: center;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			margin-top: 20px;
		}
		th, td {
			padding: 10px;
			text-align: left;
			border-bottom: 1px solid #ddd;
		}
		th {
			background-color: #4285f4;
			color: #fff;
		}
        a.button {
			
			display: inline-block;
			background-color: #4285f4;
			color: #fff;
			padding: 10px 20px;
			font-size: 1.2em;
			border: none;
			border-radius: 5px;
			text-decoration: none;
			margin-top: 20px;
			cursor: pointer;
			transition: background-color 0.3s ease;
		}
		a.button:hover {
			background-color: #3367d6;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>BlockChain Ledger</h1>
		<table>
			<thead>
				<tr>
					<th>Sender's Name</th>
					<th>Receiver's Name</th>
                    <th>Amount</th>
				</tr>
			</thead>
			<tbody>
				{{#each space}}
				<tr>
					<td>{{this.sender}}</td>
					<td>{{this.receiver}}</td>
          <td>{{this.amount}}</td>
				</tr>
				{{/each}}
			</tbody>
		</table>
        <a href="/transactions" class="button">Go To Another Transaction</a>
                <a href="/login" class="button">Logout</a>
	</div>
</body>
</html>
`;
const source1=`
<!DOCTYPE html>
<html>
<head>
    <title>Secure Bank Transactions</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* General Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
        }
        a {
            text-decoration: none;
        }
        h1 {
            text-align: center;
            margin-top: 50px;
            color: #4c96af;       }
        form {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0px 0px 10px #aaa;
        }
        label {
            display: block;
            margin-bottom: 10px;
            font-weight: bold;
            color: #333;
        }
        input[type="text"] {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }
        input[type="submit"] {
            width: 100%;
            background-color: #4c96af;
            color: white;
            padding: 14px 20px;
            margin-bottom: 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        input[type="submit"]:hover {
            background-color: #45a049;
        }
        .logout-btn {
            display: block;
            margin-top: 20px;
            text-align: center;
        }
        .logout-btn a {
            display: inline-block;
            background-color: #4c96af;
            color: white;
            padding: 10px 20px;
            font-size: 1.2em;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .logout-btn a:hover {
            background-color: #45a049;
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
            form {
                max-width: 90%;
            }
        }

    </style>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
<script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
	</head>
<body>
    <h1>Secure Bank Transactions</h1>
    <br><br>
    <form action="/transactions" method="post">
        <label for="sender">Sender username:</label>
        <input type="text"  readonly id="sender" name="sender" value="{{this.name}}">
         <br>
       <label for="receiver">Receiver username:</label>
        <input type="text" id="receiver" name="receiver">
        <label for="amount">Amount:</label>
        <input type="text" id="amount" name="amount">
        <input type="submit" value="Submit Transaction">
        <div class="logout-btn">
            <a href="/login">Logout</a>
        </div>
        <div class="logout-btn">
            <a href="/bal">Know your Balance</a>
        </div>
        </form>
</body>
</html>`;
const source2=`
<!DOCTYPE html>
<html>
<head>
	<title>Insufficient Balance</title>
	<style>
		body {
			background-color: #f2f2f2;
			font-family: Arial, sans-serif;
		}
		h1 {
			text-align: center;
			font-size: 2em;
			color: #4285f4;
			margin-top: 50px;
		}
		.container {
			max-width: 800px;
			margin: 50px auto;
			padding: 20px;
			background-color: #fff;
			box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
			border-radius: 10px;
			text-align: center;
		}
		button {
			background-color: #4285f4;
			color: #fff;
			padding: 10px 20px;
			font-size: 1.2em;
			border: none;
			border-radius: 5px;
			cursor: pointer;
			transition: background-color 0.3s ease;
		}
		button:hover {
			background-color: #3367d6;
		}
	</style>
</head>
<body>
	<div class="container"><h1>
    Total Balance:</h1>
    <h1>{{this.b}}</h1>
	<form action="/transactions">
		<button >Back</button>
	</form>
	</div>
</body>
</html>
`;
const template = handlebars.compile(source);
const template1=handlebars.compile(source1);
const template3=handlebars.compile(source2);
// middleware function to authenticate user
function authenticateUser(req, res, next) {
    // check if user is logged in
    if (false) {
        res.status(401).send('Unauthorized access. Please login to continue.');
    } else {
        next();
    }
}

// route to display the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
    /* <center><i class='fab fa-amazon-pay' style='font-size:50px'></i></center><br>
		<center><i class="fas fa-user-circle" style="font-size:60px;color:#4c96af;"></i></center>
        <center> 
     */
});

app.post("/register",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = sha256(password);
    users[username]=hashedPassword;
	balance[username]=10000;
    console.log(users);
	console.log(balance);
    res.redirect('/login');
        }

)

// route to handle login request
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // hash the password
    const hashedPassword = sha256(password);
    // check if the credentials match with the ones in the database
    if (username in users && hashedPassword == users[username]) {
        // create a session for the user
       // req.session.ip = true;
       name=username;
	   const html = template1({ name });
     // Send the HTML as the response
       res.send(html);
       } else {
        res.redirect('/error');
    }
});
app.get('/error',(req,res)=>{
    res.sendFile(__dirname+'/error.html');
})
// route to display the transactions page
app.get('/transactions', authenticateUser, (req, res) => {
    const html = template1({ name });
    // Send the HTML as the response
    res.send(html);
});
app.get('/bal', (req, res) => {
    const b=balance[name];
    const html=template3( { b });
    res.send(html);
});
// route to handle transaction request
app.post('/transactions', authenticateUser, (req, res) => {
    // retrieve transaction details from the request body
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const amount = req.body.amount;
    if(receiver in users){
    // create a new transaction object
    const transaction = {
        sender,
        receiver,
        amount
    };
    // create a hash for the transaction
    if(amount<=balance[sender]){
		console.log(balance)
        balance[sender]=balance[sender]-amount;
		balance[receiver]=parseInt(balance[receiver])+parseInt(amount);
		console.log(balance);
        const transactionHash = sha256(JSON.stringify(transaction));
        const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'sect239k1'
      });
      
      // Create
        const sign = crypto.createSign('SHA256');
        sign.write(transactionHash);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');
        data=blockchain.addTransaction(transaction, signature,publicKey);
        let space=[];
        for(let i=0;i<data.length;i++){
            if(!space.includes(data[i])) {
                space.push(data[i]);
        }

       }
        const html = template({ space });
        // Send the HTML as the response
        res.send(html);
}
    else{
       res.sendFile(__dirname+"/balanceerror.html");
    }
}
else{
	res.sendFile(__dirname + '/invalid.html');
	
}
});
app.listen(port1, () => {
    console.log('Server running on port 5000');
});