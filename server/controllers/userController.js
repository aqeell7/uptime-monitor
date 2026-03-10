import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: 'user already exists' })
    }

    const newUser = await User.create({
      name,
      email,
      password,
    })

    if (newUser) {
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id)
      })

    } else {
      return res.status(400).json({
        message: 'invalid user data'
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error' })
  }
}


export async function authUser(req, res) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }).select("+password")

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        token: generateToken(user._id)
      })
    } else {
      return res.status(401).json({
        message: "invalid email or password"
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error"
    })
  }
}

export const authGoogle = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Generate secure random string for Google Auth users who don't have a password
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      user = await User.create({
        name,
        email,
        password: generatedPassword,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error("Google Auth Error: ", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
};