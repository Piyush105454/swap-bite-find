const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegistration, validateLogin } = require('../../../shared/middleware/validation');
const { authLimiter } = require('../../../shared/middleware/rateLimiter');
const ApiResponse = require('../../../shared/utils/response');
const logger = require('../../../shared/utils/logger');
const database = require('../../../config/database');

const router = express.Router();

// Register
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;
    const supabase = database.getClient();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json(
        ApiResponse.error('User already exists', 400)
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone_number
      }
    });

    if (authError) {
      throw authError;
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        phone_number,
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random`
      })
      .select()
      .single();

    if (profileError) {
      throw profileError;
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: authUser.user.id, 
        email: authUser.user.email,
        full_name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('User registered successfully:', { userId: authUser.user.id, email });

    res.status(201).json(
      ApiResponse.success({
        user: {
          id: authUser.user.id,
          email: authUser.user.email,
          full_name,
          avatar_url: profile.avatar_url
        },
        token
      }, 'Registration successful', 201)
    );

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json(
      ApiResponse.error('Registration failed', 500)
    );
  }
});

// Login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const supabase = database.getClient();

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json(
        ApiResponse.error('Invalid credentials', 401)
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: authData.user.id, 
        email: authData.user.email,
        full_name: profile.full_name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('User logged in successfully:', { userId: authData.user.id, email });

    res.json(
      ApiResponse.success({
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url
        },
        token
      }, 'Login successful')
    );

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json(
      ApiResponse.error('Login failed', 500)
    );
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    // In a production environment, you might want to blacklist the token
    res.json(
      ApiResponse.success(null, 'Logout successful')
    );
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json(
      ApiResponse.error('Logout failed', 500)
    );
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json(
        ApiResponse.error('Refresh token required', 401)
      );
    }

    // Verify refresh token and generate new access token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json(
          ApiResponse.error('Invalid refresh token', 403)
        );
      }

      const newToken = jwt.sign(
        { 
          id: user.id, 
          email: user.email,
          full_name: user.full_name 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json(
        ApiResponse.success({ token: newToken }, 'Token refreshed')
      );
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json(
      ApiResponse.error('Token refresh failed', 500)
    );
  }
});

module.exports = router;