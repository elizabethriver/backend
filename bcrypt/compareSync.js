const bcrypt = require("bcryptjs");
const compareSync = (password, passwordFind) => {
    return bcrypt.compareSync(password, passwordFind);  
}

module.exports = compareSync;