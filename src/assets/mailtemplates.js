function changePassword (password) {
  const mailstring
    = `
    <p>Greetings!</p>
    </br>
    <p>Here is your temporary password. please login and change your password</p>
    <p>TEMPORARY PASSWORD: ${password}</p>
    </br>
    <p>Thank you very much</p>
    <p>Sincerely,</p>
    <p>REPORT API</p>
    `;
  return mailstring;
}

module.exports = {
  changePassword
};
