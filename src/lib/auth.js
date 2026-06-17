import { supabase } from './supabaseClient';

// 소셜 로그인, 현재 Google만 동작, 카카오 네이버는 안내
export async function loginWithProvider(provider) {
  if (provider !== 'google') {
    window.alert('현재는 구글 로그인만 지원해요. (카카오·네이버는 준비 중)');
    return;
  }
  const redirectTo = window.location.origin;
  console.log('[auth:debug] signInWithOAuth redirectTo =', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  // data.url = Supabase가 만든 Google 인증 URL (redirect_to, flow 확인용)
  console.log('[auth:debug] signInWithOAuth result =', { url: data?.url, error });

  if (error) window.alert(`로그인에 실패했어요: ${error.message}`);
}

export async function logout() {
  await supabase.auth.signOut();
}
