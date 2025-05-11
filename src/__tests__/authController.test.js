const { loginWithToken } = require('../controllers/authController');

// Mock Firebase Admin SDK
jest.mock('../config/firebase', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: jest.fn(() =>
        Promise.resolve({
          uid: '123',
          email: 'test@example.com',
          name: 'Test User'
        })
      )
    })
  },
  db: {} // Kosongkan karena tidak dipakai dalam loginWithToken
}));

// Mock response dan request
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe('loginWithToken', () => {
  it('should return 400 if no token is provided', async () => {
    const req = { body: {} };
    const res = mockResponse();

    await loginWithToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID Token is required!' });
  });

  it('should return user data if token is valid', async () => {
    const req = { body: { idToken: 'valid-token' } };
    const res = mockResponse();

    await loginWithToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful!',
      uid: '123',
      email: 'test@example.com',
      name: 'Test User'
    });
  });
});
