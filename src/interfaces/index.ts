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

export enum Provider {
  GOOGLE = 'GOOGLE',
  LOCAL = 'LOCAL',
}

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export type ProviderType = keyof typeof Provider;
export type RoleType = `${Role}`;

export interface Hasher {
  hash(data: string, saltRounds?: number): string;
  compare(data: string, encrypted: string): Promise<boolean>;
}
