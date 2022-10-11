import { Author } from "../types/interfaces";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

export interface AccessToken {
  userId: string;
  exp: number;
}

export interface RefreshToken {
  userId: string;
  version: number;
  exp: number;
}
enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
  RefreshIfLessThan = 4 * 24 * 60 * 60,
}

export enum Cookies {
  AccessToken = "access",
  RefreshToken = "refresh",
}
function signAccessToken(payload: { userId: string }) {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: TokenExpiration.Access,
  });
}

function signRefreshToken(payload: { userId: string; version: number }) {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: TokenExpiration.Refresh,
  });
}

export function buildTokens(user: Author) {
  const accessPayload = { userId: user.id };
  const refreshPayload = { userId: user.id, version: user.tokenVersion };

  const accessToken = signAccessToken(accessPayload);
  //@ts-ignore
  const refreshToken = signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

const isProduction = process.env.NODE_ENV === "production";

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: process.env.BASE_DOMAIN,
  path: "/",
};

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
};

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
};

export function setTokens(res: Response, access: string, refresh?: string) {
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
  if (refresh)
    res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
  if (!token) {
    return null;
  }
  return jwt.verify(token, accessTokenSecret) as AccessToken;
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw "TokenRevoked";

  const accessPayload = { userId: current.userId };

  const accessToken = signAccessToken(accessPayload);

  let refreshPayload: { userId: string; version: number } | undefined;

  const expiration = new Date(current.exp * 1000);

  const now = new Date();

  const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;

  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = { userId: current.userId, version: tokenVersion };
  }

  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

export function clearTokens(res: Response) {
  res.cookie(Cookies.AccessToken, "", { ...defaultCookieOptions, maxAge: 0 }),
    res.cookie(Cookies.RefreshToken, "", {
      ...defaultCookieOptions,
      maxAge: 0,
    });
}
