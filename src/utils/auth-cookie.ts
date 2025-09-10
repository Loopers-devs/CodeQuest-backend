import { Response } from 'express';
import { envs } from 'src/config/envs.config';

type name_cookie = 'access' | 'refresh';

interface AuthCookie {
  res: Response;
  name_cookie: name_cookie;
  value: string;
  timeout?: number;
}

export function setAuthCookie({
  res,
  name_cookie,
  value,
  timeout = 60 * 60 * 24 * 7, // Default to 7 days
}: AuthCookie): void {
  res.cookie(name_cookie, value, {
    httpOnly: envs.nodeEnv === 'production',
    secure: envs.nodeEnv === 'production',
    sameSite: envs.nodeEnv === 'production' ? 'strict' : 'lax',
    maxAge: timeout * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res: Response, name_cookie: name_cookie): void {
  res.clearCookie(name_cookie, {
    httpOnly: true,
    secure: envs.nodeEnv === 'production',
    sameSite: envs.nodeEnv === 'production' ? 'strict' : 'lax',
    maxAge: 0,
  });
}

export async function saveAuthCookie(
  res: Response,
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      setAuthCookie({
        res,
        name_cookie: 'access',
        value: accessToken,
        timeout: 60 * 60 * 24, // 1 day
      });

      setAuthCookie({
        res,
        name_cookie: 'refresh',
        value: refreshToken,
        timeout: 60 * 60 * 24 * 7, // 7 days
      });

      resolve();
    } catch {
      reject(new Error('Failed to set authentication cookies'));
    }
  });
}

export async function clearAuthCookies(res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      clearAuthCookie(res, 'access');
      clearAuthCookie(res, 'refresh');
      resolve();
    } catch {
      reject(new Error('Failed to clear authentication cookies'));
    }
  });
}
