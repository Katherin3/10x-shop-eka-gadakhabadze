/** Simulated login state kept in AuthContext (no real authentication). */
export interface AuthUser {
  username: string;
  isLoggedIn: boolean;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

/** Every field may (or may not) have an error message. */
export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;
