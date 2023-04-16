const Crypt = require('../helpers/crypt');

test('Confidential information must be encripted', async () => {
    const rawPassword = 'test password';
    const rawPaswordAux = 'second test password';
    const hashedPassword = Crypt.hashPassword(rawPassword);
    const hashedPasswordAux = Crypt.hashPassword(rawPaswordAux);
    expect(Crypt.hashPassword(rawPassword)).not.toMatch(rawPassword);
    expect(await Crypt.checkPassword(hashedPassword,rawPassword)).toBeTruthy();
    expect(await Crypt.checkPassword(hashedPasswordAux, rawPassword)).toBeFalsy();
});