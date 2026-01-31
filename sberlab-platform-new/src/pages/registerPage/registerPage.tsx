import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SvgIcon } from "../../components/ui/SvgIcon/SvgIcon";
import styles from "./registerPage.module.css";
import Button from "../../components/ui/button/button";
import { Input } from "../../components/ui/input/input";
import { authApi, RegisterRequest } from "../../api/auth"; // Импортируем API

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Шаг 1: Основная информация (для API)
    email: "",
    password: "",
    confirmPassword: "",

    // Шаг 2: Личная информация (для API)
    firstName: "",
    lastName: "",
    phone: "",

    // Шаг 3: Учебная информация (для API)
    university: "",
    faculty: "",
    course: "",
    skills: "",
    group_name: "", // Для API
    trained_level: "junior", // Для API (по умолчанию)

    // Шаг 4: Роль
    role: "student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.email) {
          newErrors.email = "Введите email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Введите корректный email";
        }

        if (!formData.password) {
          newErrors.password = "Введите пароль";
        } else if (formData.password.length < 8) {
          newErrors.password = "Пароль должен содержать минимум 8 символов";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password =
            "Пароль должен содержать заглавные и строчные буквы и цифры";
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Пароли не совпадают";
        }
        break;

      case 2:
        if (!formData.firstName) {
          newErrors.firstName = "Введите имя";
        }

        if (!formData.lastName) {
          newErrors.lastName = "Введите фамилию";
        }

        if (
          formData.phone &&
          !/^[\+]?[78][\-\s]?\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{2}[\-\s]?\d{2}$/.test(
            formData.phone,
          )
        ) {
          newErrors.phone = "Введите корректный номер телефона";
        }
        break;

      case 3:
        if (!formData.university) {
          newErrors.university = "Выберите университет";
        }

        if (!formData.faculty) {
          newErrors.faculty = "Введите факультет";
        }

        if (!formData.course) {
          newErrors.course = "Введите курс";
        } else if (
          parseInt(formData.course) < 1 ||
          parseInt(formData.course) > 6
        ) {
          newErrors.course = "Введите корректный курс (1-6)";
        }

        // Для API нужно сформировать group_name
        if (!formData.group_name) {
          newErrors.group_name = "Введите номер группы";
        }
        break;
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Функция для подготовки данных для API
  const prepareRegisterData = (): RegisterRequest => {
    // Собираем full_name из имени и фамилии
    const full_name = `${formData.firstName} ${formData.lastName}`.trim();

    // Формируем group_name на основе университета, факультета и курса
    const group_name = `${formData.university.substring(0, 3)}-${formData.faculty}-${formData.course}`;

    // Определяем trained_level на основе курса
    let trained_level = "junior";
    if (parseInt(formData.course) >= 3) trained_level = "middle";
    if (parseInt(formData.course) >= 5) trained_level = "senior";

    return {
      email: formData.email,
      password: formData.password,
      full_name,
      group_name: formData.group_name || group_name,
      trained_level: formData.trained_level || trained_level,
      skills: formData.skills,
      role: formData.role,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 4) {
      handleNextStep();
      return;
    }

    const allErrors = validateStep(1);
    Object.assign(allErrors, validateStep(2));
    Object.assign(allErrors, validateStep(3));

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Подготавливаем данные для API
      const registerData = prepareRegisterData();
      console.log("Отправка данных регистрации:", registerData);

      // Вызов реального API
      const response = await authApi.register(registerData);

      console.log("Регистрация успешна:", response);

      // Перенаправляем на страницу входа с сообщением
      navigate("/login", {
        state: {
          message: "Регистрация успешна! Теперь вы можете войти в аккаунт.",
          userId: response.user_id,
        },
      });
    } catch (error: any) {
      console.error("Ошибка регистрации:", error);
      setErrors({
        form: error.message || "Ошибка регистрации. Попробуйте позже.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Шаг 1: Создание аккаунта</h3>
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
              placeholder="Минимум 8 символов"
              icon="lock"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Должен содержать заглавные и строчные буквы и цифры"
              fullWidth
              required
            />

            <Input
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              icon="lock"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              fullWidth
              required
            />
          </div>
        );

      case 2:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Шаг 2: Личная информация</h3>
            <div className={styles.row}>
              <Input
                label="Имя"
                name="firstName"
                placeholder="Иван"
                icon="user"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                fullWidth
                required
              />

              <Input
                label="Фамилия"
                name="lastName"
                placeholder="Иванов"
                icon="user"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                fullWidth
                required
              />
            </div>

            <Input
              label="Телефон (опционально)"
              name="phone"
              type="tel"
              placeholder="+7 (999) 999-99-99"
              icon="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              fullWidth
            />
          </div>
        );

      case 3:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Шаг 3: Учебная информация</h3>

            <div className={styles.selectWrapper}>
              <label className={styles.label}>
                Университет <span className={styles.required}>*</span>
              </label>
              <select
                name="university"
                className={styles.select}
                value={formData.university}
                onChange={handleChange}
              >
                <option value="">Выберите университет</option>
                <option value="НГУ">НГУ</option>
                <option value="НГТУ">НГТУ</option>
                <option value="СибГУТИ">СибГУТИ</option>
                <option value="другой">Другой университет</option>
              </select>
              {errors.university && (
                <div className={styles.errorMessage}>{errors.university}</div>
              )}
            </div>

            <Input
              label="Факультет"
              name="faculty"
              placeholder="ФИТ, ММФ, ФФ и т.д."
              value={formData.faculty}
              onChange={handleChange}
              error={errors.faculty}
              fullWidth
              required
            />

            <Input
              label="Курс"
              name="course"
              type="number"
              min="1"
              max="6"
              placeholder="1-6"
              value={formData.course}
              onChange={handleChange}
              error={errors.course}
              fullWidth
              required
            />

            {/* Добавляем поле для номера группы */}
            <Input
              label="Номер группы"
              name="group_name"
              placeholder="Например: 22201"
              value={formData.group_name}
              onChange={handleChange}
              error={errors.group_name}
              helperText="Это поле требуется для регистрации"
              fullWidth
              required
            />

            <Input
              label="Навыки (через запятую)"
              name="skills"
              placeholder="Python, React, SQL, ..."
              value={formData.skills}
              onChange={handleChange}
              helperText="Укажите технологии и навыки, которыми владеете"
              fullWidth
            />

            {/* Добавляем выбор уровня подготовки */}
            <div className={styles.selectWrapper}>
              <label className={styles.label}>
                Уровень подготовки <span className={styles.required}>*</span>
              </label>
              <select
                name="trained_level"
                className={styles.select}
                value={formData.trained_level}
                onChange={handleChange}
              >
                <option value="junior">Junior (1-2 курс)</option>
                <option value="middle">Middle (3-4 курс)</option>
                <option value="senior">Senior (5-6 курс)</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.step}>
            <h3 className={styles.stepTitle}>Шаг 4: Выбор роли</h3>
            <p className={styles.stepDescription}>
              Выберите, как вы будете использовать платформу
            </p>

            <div className={styles.roleOptions}>
              <label
                className={`${styles.roleOption} ${formData.role === "student" ? styles.selected : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <div className={styles.roleContent}>
                  <SvgIcon name="user" width={32} height={32} color="#00A36F" />
                  <div>
                    <h4>Студент</h4>
                    <p>
                      Ищите проекты, присоединяйтесь к командам, развивайте
                      навыки
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`${styles.roleOption} ${formData.role === "mentor" ? styles.selected : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="mentor"
                  checked={formData.role === "mentor"}
                  onChange={handleChange}
                  className={styles.radioInput}
                />
                <div className={styles.roleContent}>
                  <SvgIcon
                    name="briefcase"
                    width={32}
                    height={32}
                    color="#00A36F"
                  />
                  <div>
                    <h4>Ментор / Куратор</h4>
                    <p>
                      Создавайте проекты, руководите студентами, делитесь опытом
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className={styles.terms}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className={styles.checkbox}
                />
                <span>
                  Я соглашаюсь с{" "}
                  <Link to="/terms" className={styles.link}>
                    условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link to="/privacy" className={styles.link}>
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Прогресс бар */}
        <div className={styles.progress}>
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className={styles.progressStep}>
              <div
                className={`${styles.progressCircle} ${stepNum <= step ? styles.active : ""}`}
              >
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`${styles.progressLine} ${stepNum < step ? styles.active : ""}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Форма регистрации */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Регистрация</h2>
            <p className={styles.subtitle}>
              Создайте аккаунт для доступа к проектам СберЛаб-НГУ
            </p>
          </div>

          {errors.form && (
            <div className={styles.errorAlert}>
              <SvgIcon name="alert-circle" width={18} height={18} />
              <span>{errors.form}</span>
            </div>
          )}

          {renderStep()}

          {/* Кнопки навигации */}
          <div className={styles.actions}>
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handlePrevStep}
                disabled={isLoading}
              >
                Назад
              </Button>
            )}

            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading
                ? "Регистрация..."
                : step < 4
                  ? "Далее"
                  : "Зарегистрироваться"}
            </Button>
          </div>

          {/* Ссылка на вход */}
          <div className={styles.footer}>
            <span>Уже есть аккаунт?</span>
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
