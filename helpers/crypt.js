const crypt = {};
const bcrypt = require('bcrypt');

crypt.hashPassword = (password) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

crypt.checkPassword = async (hashedPassword, password) => {
    return await bcrypt.compare(password,hashedPassword);
}

module.exports = crypt;