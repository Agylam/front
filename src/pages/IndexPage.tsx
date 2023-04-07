import React, {useState} from "react";
import {useJwt} from "react-jwt";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImg from "../assets/logo.svg";
import "../css/index.css";

import IUser from "../interfaces/IUser";
import authFetch from "../fetches/authFetch";
import ThemeSwitcherComponent from "../сomponents/ThemeSwitcherComponent";

export default function IndexPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const auth = async () => {
    try {
      const token: string = await authFetch(email, password);

      localStorage.setItem("jwt", token);
      toast.success("Успешно!", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 1000,
        onClose: () => {
          navigate("/schedule");
        },
      });
    } catch (e) {
      toast.error("Неверные почта или пароль!", {
        position: toast.POSITION.BOTTOM_LEFT,
        autoClose: 2000,
      });
    }
  };

  const { isExpired } = useJwt<IUser>(localStorage.getItem("jwt") as string);
  if (!isExpired) {
    navigate("/schedule");
  }
  return (
    <div className="wrapper">
      <ToastContainer limit={3} />
      <div id="auth">
        <img src={logoImg} alt="" id="logo" />
        <div id="auth_inputs">
          <input
            type="email"
            id="email"
            className="auth_inp"
            required
            placeholder="Почта"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            id="password"
            className="auth_inp"
            required
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button id="button" onClick={auth}>
            Войти
          </button>
        </div>
        <p id="rem_pass">
          Для смены пароля свяжитесь с <span className="mimbol">@mimbol</span>
        </p>
      </div>
      <ThemeSwitcherComponent />
    </div>
  );
}

