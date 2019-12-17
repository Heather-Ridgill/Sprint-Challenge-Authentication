const bcrypt = require(`bcryptjs`);
const db = require(`../api/apiHelper`);
const jwt = require (`jsonwebtoken`);
const secrets = require (`../config/secrets`);



const router = require('express').Router();


router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

db.addUser(user)
.then(id => {
  res.status(201).json(id);
})
.catch(error => {
  res.status(500).json({message: "Sorry, there was an error adding this user"});
  });
});

router.post('/login', (req, res) => {
  // implement login
let { username, password} = req.body;
// console.log(req.body)
db.findBy({ username })
.then(user => {
  if (user && bcrypt.compareSync (password, user.password)) {
    
    const token = generateToken(user);
    res.status(200).json({ message: `Welcome ${user.username}! Have a token: `, 
  token: token
 });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
})
.catch(err => {
  res.status(500).json({ message: "Sorry, cant log you in .... " });
  });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: `1d`
  };

  const token = jwt.sign(payload, secrets.jwtSecrets, options);
  console.log(token)
  return token
}

module.exports = router;
