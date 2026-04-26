const bcrypt = require('bcrypt');

(async () => {
  const password = 'adopto_adm';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
})();

