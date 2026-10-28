import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types/user';

/**
 * P0.2 — simulated login. Only the username and a logged-in flag live in
 * React state. Nothing is sent to a server and nothing is persisted, so a
 * page refresh logs the user out (allowed by the PRD).
 */
interface AuthContextValue {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
}

const GUEST: AuthUser = { username: '', isLoggedIn: false };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(GUEST);

  function login(username: string): void {
    setUser({ username, isLoggedIn: true });
  }

  function logout(): void {
    // Only the login state is reset — the cart is NOT touched (P0.3).
    setUser(GUEST);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

/** Read the auth state anywhere below <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
