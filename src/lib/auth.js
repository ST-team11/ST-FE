import { supabase } from './supabaseClient';

// // 소셜 로그인, 현재 Google만 동작, 카카오 네이버는 안내
// export async function loginWithProvider(provider) {
//   if (provider !== 'google') {
//     window.alert('현재는 구글 로그인만 지원해요. (카카오·네이버는 준비 중)');
//     return;
//   }
//   const redirectTo = window.location.origin;
//   console.log('[auth:debug] signInWithOAuth redirectTo =', redirectTo);

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: 'google',
//     options: { redirectTo },
//   });

//   // data.url = Supabase가 만든 Google 인증 URL (redirect_to, flow 확인용)
//   console.log('[auth:debug] signInWithOAuth result =', { url: data?.url, error });

//   if (error) window.alert(`로그인에 실패했어요: ${error.message}`);
// }

  // 소셜 로그인 (Google, Kakao 지원)
  export async function loginWithProvider(provider) {

    const redirectTo = window.location.origin;
    console.log(`[auth:debug] signInWithOAuth (${provider}) redirectTo =`, redirectTo);

    // 하드코딩되어 있던 'google' 대신 매개변수로 받은 provider를 그대로 넣습니다.
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider, 
      options: { redirectTo },
    });

    // Supabase가 생성한 인증 URL 및 에러 로그 확인
    console.log(`[auth:debug] signInWithOAuth (${provider}) result =`, { url: data?.url, error });

    if (error) window.alert(`로그인에 실패했어요: ${error.message}`);
  }

export async function logout() {
  await supabase.auth.signOut();
  // 상태 변경 이벤트 발생 (mock client 지원)
  window.dispatchEvent(new Event('auth-state-change'));
}
