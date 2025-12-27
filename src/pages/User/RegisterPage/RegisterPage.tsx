// src/pages/RegisterPage.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useUsers, useCreateUser } from "../../../api";
import type { User } from "../../../types";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import './RegisterPage.scss';

type RegisterFormInputs = {
  username: string; 
  password: string;
  confirm: string;
  remember?: boolean;
};

const schema: yup.ObjectSchema<RegisterFormInputs> = yup
  .object({
    username: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
    password: yup.string().required("Vui lòng nhập mật khẩu").min(4, "Mật khẩu tối thiểu 4 ký tự"),
    confirm: yup.string().required("Vui lòng xác nhận mật khẩu").oneOf([yup.ref("password")], "Mật khẩu không khớp"),
    remember: yup.boolean().optional(),
  })
  .required();

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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users to check for duplicates
  const { data: existingUsers = [] } = useUsers();
  const createUserMutation = useCreateUser();

  useEffect(() => {
    seedAdminIfMissing();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    const email = String(data.username).trim().toLowerCase();
    const password = String(data.password);

    try {
      // Check if email already exists
      if (existingUsers.some((u: any) => u.email === email)) {
        toast.error("Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.", {
          position: 'bottom-right',
        });
        return;
      }

      // Create new user with minimal info
      const newUser: Omit<User, "id"> = {
        name: email.split("@")[0] || email,
        username: email.split("@")[0] || email,
        email,
        password,
        role: "user",
        status: "active",
        fullName: "",
        phone: "",
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(email),
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      // Use API hook to create user
      createUserMutation.mutate(newUser, {
        onSuccess: () => {
          // Không auto login sau đăng ký, yêu cầu người dùng login

          toast.success("Đăng ký thành công! Vui lòng hoàn thành hồ sơ cá nhân.", {
            position: 'bottom-right',
          });
          navigate("/login");
        },
        onError: (error) => {
          console.error("Register error:", error);
          toast.error("Lỗi khi đăng ký. Vui lòng thử lại!", {
            position: 'bottom-right',
          });
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Lỗi khi đăng ký. Vui lòng thử lại!", {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="register-page">
      <div className="auth-card">
        <div className="auth-card__inner">
          <div className="auth-header">
            <h1 className="auth-title">Chào mừng đến <span className="brand">E-Shop</span></h1>
            <p className="auth-subtitle">đăng ký tài khoản E-Shop của bạn</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register("username")}
                className="form-input"
                placeholder="email@example.com"
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

            <div className="form-group">
              <label className="form-label">Xác Nhận Mật Khẩu</label>
              <div className="input-wrapper">
                <input
                  {...register("confirm")}
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="eye-toggle" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirm && <p className="form-error">{errors.confirm.message}</p>}
            </div>

            <div className="form-row">
              <label className="checkbox-label">
                <input type="checkbox" {...register("remember")} className="form-checkbox" />
                <span className="checkbox-text">Ghi nhớ đăng nhập</span>
              </label>

              <a href="#" className="link-forgot">Quên mật khẩu?</a>
            </div>

            <div className="form-group">
              <button className="btn btn--primary btn-login" type="submit">Đăng Ký</button>
            </div>
          </form>

          <div className="auth-footer">
            Đã có tài khoản? <a href="/login" className="auth-link">Đăng Nhập</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
