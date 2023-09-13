import AuthService from "src/services/AuthService.ts";

interface ICallApi<T> {
  url: string;
  method?: string;
  body?: T;
}

interface IError {
  msg: string;
  path: string;
}

let isRetry = false;

export default async function callApi<T>({ url, method, body }: ICallApi<T>) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401 && !isRetry) {
    isRetry = true;
    try {
      const res = await AuthService.checkAuth();
      localStorage.setItem("token", res.accessToken);
      await callApi({ url, method, body });
    } catch (e) {
      if (token) {
        localStorage.removeItem("token");
        document.location.reload();
      }
    }
  }

  const json = await res.json();

  if (!res.ok) {
    throw (
      json.errors?.map((el: IError) => `${el.msg}: ${el.path}`).join(", ") ||
      json.message
    );
  }

  return json;
}
