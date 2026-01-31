import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./loginPage.module.css";
import Button from "../../components/ui/button/button";
import { Input } from "../../components/ui/input/input";
import { SvgIcon } from "../../components/ui/SvgIcon/SvgIcon";
import { authApi, LoginRequest } from "../../api/auth";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Введите email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.login(formData);

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      console.log("Вход выполнен успешно:", response);

      const userInfo = await authApi.getMe(response.access_token);
      console.log("Информация о пользователе:", userInfo);

      localStorage.setItem("user_id", userInfo.user_id);
      localStorage.setItem("user_role", userInfo.role);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Ошибка входа:", error);
      setErrors({
        form: error.message || "Ошибка входа. Проверьте email и пароль.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <h1 className={styles.title}>Вход в аккаунт</h1>
          </div>
        </div>

        {/* Форма входа */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.form && (
            <div className={styles.errorAlert}>
              <SvgIcon name="alert-circle" width={18} height={18} />
              <span>{errors.form}</span>
            </div>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="student@nsu.ru"
            icon="mail"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
            required
          />

          <Input
            label="Пароль"
            name="password"
            type="password"
            placeholder="Введите пароль"
            icon="lock"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
            required
          />

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>

        <div className={styles.footer}>
          <span>Ещё нет аккаунта?</span>
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
