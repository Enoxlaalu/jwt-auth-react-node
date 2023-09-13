import { useEffect, useState } from "react";
import Button from "src/components/Button/Button";
import Input from "src/components/Input/Input";
import AuthService from "src/services/AuthService";
import { IUser } from "src/models/IUser.ts";
import UserService from "src/services/UserService.ts";
import { UserResponse } from "src/models/response/UserResponse.ts";
import styles from "./styles.module.scss";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [usersList, setUsersList] = useState<UserResponse[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const checkAuth = async () => {
        const res = await AuthService.checkAuth();
        localStorage.setItem("token", res.accessToken);
        setAuth(true);
        setUser(res.user);
      };
      checkAuth();
    }
  }, []);

  const onChangeEmail = (v: string) => setEmail(v);
  const onChangePass = (v: string) => setPassword(v);

  const login = async () => {
    try {
      const res = await AuthService.login(email, password);
      localStorage.setItem("token", res.accessToken);
      setAuth(true);
      setUser(res.user);
    } catch (e) {
      setError(e as string);
    }
  };

  const register = async () => {
    try {
      const res = await AuthService.register(email, password);
      localStorage.setItem("token", res.accessToken);
      setAuth(true);
      setUser(res.user);
    } catch (e) {
      setError(e as string);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
      setAuth(false);
      setUser(null);
      setError("");
    } catch (e) {
      setError(e as string);
    }
  };

  const getUsers = async () => {
    try {
      const users = await UserService.getUsers();
      setUsersList(users);
    } catch (e) {
      setError(e as string);
    }
  };

  return (
    <main className={styles.page}>
      {auth ? (
        <>
          <p>You are authorized</p>
          {!user?.isActivated && (
            <p>Please check your email and activate your account</p>
          )}
          <Button text="Logout" onClick={logout} />
        </>
      ) : (
        <>
          <Input id="email" onChange={onChangeEmail} value={email} />
          <Input id="pass" onChange={onChangePass} value={password} />
          {error ? <p className={styles.error}>{error}</p> : ""}
          <Button text="Login" onClick={login} />
          <Button text="Sign in" onClick={register} />
        </>
      )}
      <Button text="Get users" onClick={getUsers} />
      {auth && usersList.length
        ? usersList.map((u) => <span key={u._id}>{u.email}</span>)
        : ""}
    </main>
  );
}

export default App;
