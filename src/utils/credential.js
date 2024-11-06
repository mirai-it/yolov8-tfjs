const authURL = "https://n26a_backend.mirai-th-kakenn.workers.dev/auth/login";

export async function credentialScan() {
  const { savedToken, savedExpiry } = loadSavedCredentials();
  if (savedToken && !isTokenExpired(savedExpiry)) {
    console.log("クレデンシャルを再利用しました");
    return savedToken;
  }
  console.log("トークンの有効期限が切れています");

  const { userid, password } = getCredentialsFromPrompt();

  try {
    const { token, expiry } = await loginAndGetToken(userid, password);
    saveCredentials(token, expiry);
    return token;
  } catch (error) {
    throw new Error(`ログインに失敗しました: ${error.message}`);
  }
}

export function getCredentialsFromPrompt() {
  const userid = window.prompt("ユーザーIDを入力してください:");
  const password = window.prompt("パスワードを入力してください:");
  return { userid, password };
}

export function isTokenExpired(expiryStr) {
  const expiry = new Date(expiryStr);
  return new Date() > expiry;
}

export async function loginAndGetToken(userid, password) {
  const data = { id: userid, password: password };

  try {
    const response = await fetch(authURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`ログインに失敗しました。ステータスコード: ${response.status}`);
    }

    const result = await response.json();
    return {
      token: result.token.token,
      expiry: result.token.exp,
    };
  } catch (error) {
    throw new Error(`ログインリクエストの送信に失敗しました: ${error.message}`);
  }
}

export function loadSavedCredentials() {
  const savedCredentials = sessionStorage.getItem('credentials');
  if (savedCredentials) {
    console.log("過去のクレデンシャルを発見");
    const { token, exp } = JSON.parse(savedCredentials);
    return { savedToken: token, savedExpiry: exp };
  } else {
    console.log("過去のクレデンシャルがありません。");
    return { savedToken: null, savedExpiry: null };
  }
}

export function saveCredentials(token, expiry) {
  try {
    const credentials = JSON.stringify({ token, exp: expiry });
    sessionStorage.setItem('credentials', credentials);
  } catch (error) {
    console.warn("警告: 認証情報の保存に失敗しました:", error);
  }
}

export function setLocationId(id) {
  return window.localStorage.setItem("locationId", id) || "";
}

export function getLocationId() {
  return window.localStorage.getItem("locationId") || "";
}

export function getLocationIdDoseNotExistSet() {
  const locateId = window.localStorage.getItem("locationId");
  if (locateId === null || locateId === "") {
    const ans = window.prompt("ロケーションID", "") || "";
    window.localStorage.setItem("locationId", ans);
    return ans;
  } else {
    return locateId;
  }
}