
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import './LoginPage.scss';

type LoginFormInputs = {
  username: string; 
  password: string;
  remember?: boolean;
};

const schema = yup.object().shape({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const ADMIN_EMAIL = "admin123@gmail.com";
const ADMIN_PW = "admin123";

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const seedAdminIfMissing = () => {
  try {
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const hasAdmin = users.some((u: any) => u.email === ADMIN_EMAIL && u.role === "admin");
    if (!hasAdmin) {
      const admin = {
        id: makeId(),
        name: "Admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PW,
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      users.push(admin);
      localStorage.setItem("users", JSON.stringify(users));
    }
  } catch (err) {
    console.error("seedAdminIfMissing:", err);
  }
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    seedAdminIfMissing();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    const username = String(data.username).trim().toLowerCase();
    const password = String(data.password);

    let users: any[] = [];
    try {
      users = JSON.parse(localStorage.getItem("users") || "[]");
    } catch {
      users = [];
    }

    if (username === ADMIN_EMAIL && password === ADMIN_PW) {
      let admin = users.find((u) => u.email === ADMIN_EMAIL && u.role === "admin");
      if (!admin) {
        admin = {
          id: makeId(),
          name: "Admin",
          email: ADMIN_EMAIL,
          password: ADMIN_PW,
          role: "admin",
          createdAt: new Date().toISOString(),
        };
        users.push(admin);
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Use store properly with a User object and a token
      loginStore({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' }, 'admin-token');
      toast.success("Đăng nhập thành công tài khoản admin", {
        autoClose: 1500
      });
      
      navigate("/admin");
      return;
    }

    const found = users.find((u) => u.email === username && u.password === password);
    if (!found) {
        toast.error("Email hoặc mật khẩu không đúng (hoặc chưa đăng ký).", {
        autoClose: 1500
      });
      return;
    }

    // Log user into store
    loginStore({ id: found.id, name: found.name, email: found.email, role: found.role || 'user' }, 'user-token');
    toast.success("Đăng nhập thành công!", {
      autoClose: 1500
    });
    if ((found.role || 'user') === "admin") navigate("/admin");
    else navigate("/");
  };

  return (
    <div className="login-page">
      <div className="auth-card">
        <div className="auth-card__inner">
          <div className="auth-header">
            <h1 className="auth-title">welcome to <span className="brand">E-Shop</span></h1>
            <p className="auth-subtitle">login to your E-Shop account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register("username")}
                className="form-input"
                placeholder="Nhập email..."
              />
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="eye-toggle" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" {...register("remember")} className="form-checkbox" />
                <span className="checkbox-text">Ghi nhớ đăng nhập</span>
              </label>

              <a href="#" className="link-forgot">Quên mật khẩu?</a>
            </div>

            <div className="form-group">
              <button className="btn btn--primary btn-login" type="submit">Đăng nhập</button>
            </div>
          </form>

          <div className="auth-footer">
            Chưa có tài khoản? <Link to="/register" className="auth-link">Đăng ký</Link>
          </div>
          <div className="auth-note">
            Admin - admin123@gmail.com | admin123
            <br />User - abc@gmail.com | 1234
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
