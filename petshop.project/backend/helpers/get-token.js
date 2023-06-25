const getToken = (req) =>{

const authHeader = req.headers.autorizacao
const token = authHeader.split("")[1]

return token
}
module.exports = getToken