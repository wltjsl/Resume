import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/index.js";
import authMiddleware from "../middlewares/need-signin.middleware.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/** 사용자 회원가입 API **/
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, passwordCheck, userName } = req.body;
    const isExistEmail = await prisma.users.findFirst({
      where: {
        email
      }
    });
    const isExistUser = await prisma.users.findFirst({
      where: {
        userName
      }
    });

    if (!email) {
      return res.status(400).json({ message: "이메일이 입력되지 않았습니다." });
    }
    if (!password) {
      return res.status(400).json({ message: "비밀번호가 입력되지 않았습니다." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "비밀번호는 6자 이상이어야 합니다." });
    }
    if (!passwordCheck) {
      return res.status(400).json({ message: "비밀번호를 다시 한 번 입력해주세요." });
    }
    if (!userName) {
      return res.status(400).json({ message: "이름이 입력되지 않았습니다." });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    if (isExistEmail) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }
    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이름입니다." });
    }

    // 사용자 비밀번호를 암호화합니다.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Users 테이블에 사용자를 추가합니다.
    await prisma.users.create({
      data: {
        userName,
        email,
        password: hashedPassword // 암호화된 비밀번호를 저장합니다.
      }
    });

    const createdUser = await prisma.users.findFirst({
      where: { email },
      select: {
        userId: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json({ createdUser: createdUser, message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

/** 로그인 API **/
router.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
    else if (user.email !== email) {
      return res.status(401).json({ message: "이메일이 일치하지 않습니다." });
    } else if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다.
    const token = jwt.sign(
      {
        userId: user.userId
      },
      `${process.env.MONGODB_DB_NAME}`
    );

    // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장합니다.
    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "로그인 성공" });
  } catch (err) {
    next(err);
  }
});

/** 사용자 조회 API **/
router.get("/users", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.locals.user;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        userName: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
