export interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
  provider: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
}

export interface DiscordProfile {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  global_name: string;
  avatar_decoration_data: Record<string, unknown> | null;
  collectibles: unknown[] | null;
  display_name_styles: string[] | null;
  banner_color: string | null;
  clan: string | null;
  primary_guild: string | null;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
  verified: boolean;
  provider: string;
  accessToken: string;
  fetchedAt: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum UserProvider {
  CREDENTIALS = 'CREDENTIALS',
  GOOGLE = 'GOOGLE',
  DISCORD = 'DISCORD',
}

export enum PostStatus{
  DRAFT='DRAFT',
  PUBLISHED='PUBLISHED',
  ARCHIVED='ARCHIVED'
}

export enum PostVisibility{
  PUBLIC='PUBLIC',
  MEMBERS='MEMBERS',
  PRIVATE='PRIVATE'

}

export type RoleType = `${Role}`;
export type ProviderType = `${UserProvider}`;

export interface Hasher {
  hash(data: string, saltRounds?: number): string;
  compare(data: string, encrypted: string): Promise<boolean>;
}


