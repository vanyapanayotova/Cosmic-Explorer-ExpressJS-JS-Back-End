import jsonwebtoken from 'jsonwebtoken';
import util from 'util'

const verify = util.promisify(jsonwebtoken.verify);
const sign = util.promisify(jsonwebtoken.sign);

export default {
    verify,
    sign,
}
