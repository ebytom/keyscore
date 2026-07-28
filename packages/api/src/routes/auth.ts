import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { config } from '../config/index.js';
import { User, IUser } from '../models/User.js';
import { validateBody } from '../middleware/validate.js';
import { authenticate, AuthRequest, JWTPayload } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { registerSchema, loginSchema } from '@ajc/shared';

const router = Router();

// JWT Token Generation
const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email } as JWTPayload,
    config.jwt.secret,
    { expiresIn: config.jwt.accessExpiry }
  );
};

const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id, email: user.email } as JWTPayload,
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiry }
  );
};

// Configure Passport strategies
if (config.oauth.google.clientId) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.oauth.google.clientId,
        clientSecret: config.oauth.google.clientSecret,
        callbackURL: config.oauth.google.callbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            provider: 'google',
            providerId: profile.id,
          });

          if (!user) {
            user = await User.findOne({ email: profile.emails?.[0]?.value });

            if (user) {
              user.provider = 'google';
              user.providerId = profile.id;
              user.profileImageUrl = profile.photos?.[0]?.value;
              await user.save();
            } else {
              user = await User.create({
                email: profile.emails?.[0]?.value,
                firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'User',
                lastName: profile.name?.familyName || profile.displayName?.split(' ')[1] || '',
                profileImageUrl: profile.photos?.[0]?.value,
                provider: 'google',
                providerId: profile.id,
                isEmailVerified: true,
              });
            }
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

if (config.oauth.github.clientId) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.oauth.github.clientId,
        clientSecret: config.oauth.github.clientSecret,
        callbackURL: config.oauth.github.callbackUrl,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          let user = await User.findOne({
            provider: 'github',
            providerId: profile.id,
          });

          if (!user) {
            const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
            user = await User.findOne({ email });

            if (user) {
              user.provider = 'github';
              user.providerId = profile.id;
              user.profileImageUrl = profile.photos?.[0]?.value;
              await user.save();
            } else {
              const nameParts = (profile.displayName || profile.username || 'User').split(' ');
              user = await User.create({
                email,
                firstName: nameParts[0] || 'User',
                lastName: nameParts.slice(1).join(' ') || '',
                profileImageUrl: profile.photos?.[0]?.value,
                provider: 'github',
                providerId: profile.id,
                isEmailVerified: true,
              });
            }
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

// Register
router.post('/register', validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400, 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      provider: 'local',
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        profileImageUrl: user.profileImageUrl,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        profileImageUrl: user.profileImageUrl,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh Token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400, 'REFRESH_TOKEN_REQUIRED');
    }

    const decoded = jwt.verify(refreshToken, config.jwt.secret) as JWTPayload;
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    // Remove old refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
        code: 'REFRESH_TOKEN_EXPIRED',
      });
    }
    next(error);
  }
});

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user!;

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get Current User
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = req.user!;
  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tier: user.tier,
      profileImageUrl: user.profileImageUrl,
      isEmailVerified: user.isEmailVerified,
      provider: user.provider,
      createdAt: user.createdAt,
    },
  });
});

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.clientUrl}/login?error=oauth_failed` }),
  async (req, res) => {
    const user = req.user as IUser;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.redirect(`${config.clientUrl}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${config.clientUrl}/login?error=oauth_failed` }),
  async (req, res) => {
    const user = req.user as IUser;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.redirect(`${config.clientUrl}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

// Forgot Password (placeholder)
router.post('/forgot-password', async (req, res) => {
  // TODO: Implement email sending
  res.json({
    success: true,
    message: 'If an account exists with this email, a password reset link will be sent.',
  });
});

export default router;
