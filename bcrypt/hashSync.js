const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const hashSync = (password) => {
    return  bcrypt.hashSync(password, salt);  
}
module.exports = hashSync;