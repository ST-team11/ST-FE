import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Mock Supabase client for development mode (when env vars are not set)
const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: async () => {
        const storedUser = localStorage.getItem('mock_user');
        const session = storedUser ? { user: JSON.parse(storedUser) } : null;
        return { data: { session }, error: null };
      },
      getUser: async () => {
        const storedUser = localStorage.getItem('mock_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        return { data: { user }, error: null };
      },
      signInWithOAuth: async ({ provider, options }) => {
        console.log(`[auth:mock] signInWithOAuth (${provider})`);
        // Mock login - store user in localStorage
        const mockUser = {
          id: 'mock_' + Date.now(),
          email: `user_${provider}@example.com`,
          user_metadata: { provider }
        };
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        // Dispatch event to update auth state
        window.dispatchEvent(new Event('auth-state-change'));
        return { data: { url: options.redirectTo }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('mock_user');
        window.dispatchEvent(new Event('auth-state-change'));
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        const handleStorageChange = () => {
          const storedUser = localStorage.getItem('mock_user');
          const user = storedUser ? JSON.parse(storedUser) : null;
          callback('INITIAL_SESSION', { user });
        };
        // Check initial state
        handleStorageChange();
        // Listen for changes
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-state-change', handleStorageChange);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                window.removeEventListener('storage', handleStorageChange);
                window.removeEventListener('auth-state-change', handleStorageChange);
              },
            },
          },
        };
      },
    },
  };
};

let supabase;

// Check if we have valid Supabase config
const isValidSupabaseConfig = supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey && supabaseAnonKey.length > 0;

if (!isValidSupabaseConfig) {
  console.warn('[auth:debug] Supabase env vars not properly set. Using mock client for development.');
  supabase = createMockSupabaseClient();
} else {
  // 로그인 진단: supabase가 URL 해시를 소비하기 전에 복귀 URL 원본 기록
  if (typeof window !== "undefined") {
    console.log("[auth:debug] entry href =", window.location.href);
    console.log("[auth:debug] entry origin =", window.location.origin);
    console.log("[auth:debug] entry hash =", window.location.hash || "(none)");
    console.log("[auth:debug] entry search =", window.location.search || "(none)");
  }
  // 세션은 localStorage에 자동 저장 갱신 (persistSession 기본값)
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
