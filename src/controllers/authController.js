import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import object from '../utils/object.js';


const invalidatedTokens = new Set();

const register = async (req, res) => {
  try {
    const { email, password,confirm_password,  name } = req.body;

    // Verify email if not existing
    const existingUser = await prisma.users.findFirst({ where: { email: email } });
    
    if(existingUser){
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Vérification des mot de passe si correspondant
    if(password !== confirm_password){
      return res.status(400).json({ error: 'Password not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate validate token
    const validateToken = object.generateToken();

    // Create user in database
    let newUser = await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
        validate_token: validateToken,
      },
    });

    // convert BigInt to String
    newUser = object.toObject(newUser);

    // remove le password
    delete newUser.password;

    res.status(201).json({ message: 'User created successfully', user: newUser });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    let user = await prisma.users.findFirst({ 
      where: { email: email }, 
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // convert BigInt to String
    user = object.toObject(user);


    const token = jwt.sign({ userId: user.users_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Generate JWT token
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    invalidatedTokens.add(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;


    // Update account
    let updateUser = await prisma.users.updateMany({
      where: { validate_token: token },
      data: {
        validate_token: null,
        email_verified_at: new Date(),
        status: 'ACTIVE'
      },
    });

    if(updateUser.count === 0){
      return res.status(404).json({ error: 'Invalid token' });
    }


    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Invalid token or Internal Server Error' });
  }
};

const createNewPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { users_id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Invalid token or Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.user;

    const user = await prisma.users.findUnique({ where: { users_id: userId } });

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { users_id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const test = async (req, res) => {
  try {

    // Vérification des token 
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }else{
      const token = authHeader.split(' ')[1];
      if(invalidatedTokens.has(token)){
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
      console.log(userId);
      res.json({ message: 'Token validé' });
    
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { register, login, logout, verifyAccount, createNewPassword, changePassword, test };
