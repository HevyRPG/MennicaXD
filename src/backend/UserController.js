const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('./config'); // Assuming you have a config file with the secret key

const { UserManager, SignInManager } = require('your-user-manager-package'); // Replace with your user manager package
const { IdentityUser } = require('your-identity-user-package'); // Replace with your identity user package

async function login(req, res) {
    const { username, password } = req.body;

    const user = await UserManager.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const isSucceed = await SignInManager.checkPasswordSignIn(user, password, { lockoutOnFailure: false });
    if (isSucceed) {
        const token = generateJwtToken(user);

        return res.json({ Token: token });
    }

    return res.status(401).json({ message: 'Unauthorized' });
}

function generateJwtToken(user) {
    const token = jwt.sign({ name: user.username }, JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

module.exports = {
    login
};
