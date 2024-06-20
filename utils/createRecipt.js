const crypto = require('crypto');

const generateReceipt = () => {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const randomStr = crypto.randomBytes(4).toString('hex');
  
  return `rcpt_${timestamp}_${randomStr}`;
};

module.exports = generateReceipt;
