const bcrypt = require(`bcryptjs`);
const db = require(`../api/apiHelper`);
const jwt = require (`jsonwebtoken`);



const router = require('express').Router();


router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

db.add (user)
.then(saved => {
  res.status(201).json(saved);
})
.catch(error => {
  res.status(500).json({message: "Sorry, there was an error adding this user"});
  });
});

router.post('/login', (req, res) => {
  // implement login
let { username, password} = req.headers;

db.findBy({ username })
.first()
.then(user => {
  if (user && bcrypt.compareSync (password, user.password)) {
    let token = generateToken(user);
    res.status(200).json({ message: `Welcome ${username}! Have a token: `, token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
})
.catch(err => {
  res.status(500).json({ message: "Sorry, cant log in .... " });
  });
});

function genToken(user) {
  const payload = {
    userid: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: `1d`
  };

  const token = jwt.sign(payload, secrets.jwtSecrets, options);
  return token;
}

module.exports = router;
