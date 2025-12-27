
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
import { useUsers } from "../../../api";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
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

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginStore = useAuthStore((s) => s.login);
  const { addItem } = useCartStore();
  const [showPassword, setShowPassword] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users from API hook
  const { data: users = [] } = useUsers();

  // Handle redirect after login
  useEffect(() => {
    if (redirectPath) {
      console.log('REDIRECT PATH SET:', redirectPath);
      const timer = setTimeout(() => {
        console.log('NAVIGATING TO:', redirectPath);
        navigate(redirectPath);
      }, 1500);
      return () => clearTimeout(timer);
    }
    return;
  }, [redirectPath, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormInputs): Promise<void> => {
    console.log('onSubmit called with:', { username: data.username, password: '***' });
    const username = String(data.username).trim().toLowerCase();
    const password = String(data.password);

    setIsLoading(true);
    
    try {
      // Use pre-fetched users from hook
      if (!users || users.length === 0) {
        toast.error("Đang tải dữ liệu người dùng. Vui lòng thử lại!", {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#dc3545',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
        });
        setIsLoading(false);
        return;
      }
      
      // Find user by username or email
      const found = users.find((u: any) => 
        (u.username?.toLowerCase() === username || u.email?.toLowerCase() === username) && 
        u.password === password
      );

      if (!found) {
        toast.error("Tên đăng nhập/email hoặc mật khẩu không đúng!", {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#dc3545',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
        });
        setIsLoading(false);
        return;
      }

      // Log user into store
      loginStore(
        { 
          id: found.id, 
          name: found.fullName || found.username, 
          email: found.email, 
          role: found.role || 'user' 
        }, 
        'user-token'
      );
      
      console.log('USER LOGIN SUCCESS:', found);
      toast.success("Đăng nhập thành công!", {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#173036',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      });
      
      // ⭐ Tự động thêm vào giỏ nếu có product info từ state
      const state = location.state as any;
      if (state?.productInfo) {
        const productInfo = state.productInfo;
        const item = {
          id: productInfo.id,
          name: productInfo.name,
          price: productInfo.price,
          quantity: productInfo.quantity,
          image: productInfo.image,
          color: productInfo.color,
          size: productInfo.size,
        };
        addItem(item);
        toast.success(`Đã thêm ${productInfo.quantity} ${productInfo.name} vào giỏ hàng!`, {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#28a745',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
        });
      }
      
      // ⭐ Redirect based on role hoặc từ state
      if (found.role === "admin") {
        console.log('SETTING REDIRECT TO /admin');
        setRedirectPath("/admin");
      } else {
        // Nếu có "from" trong state (từ product detail), redirect về đó
        const redirectTo = state?.from || "/";
        console.log('SETTING REDIRECT TO:', redirectTo);
        setRedirectPath(redirectTo);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Có lỗi khi đăng nhập. Vui lòng thử lại!", {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: '#dc3545',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-card">
        <div className="auth-card__inner">
          <div className="auth-header">
            <h1 className="auth-title">Chào mừng đến <span className="brand">E-Shop</span></h1>
            <p className="auth-subtitle">Đăng nhập vào tài khoản E-Shop của bạn</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                {...register("username")}
                className="form-input"
                placeholder="Nhập email của bạn..."
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
                <span className="checkbox-text">Ghi nhớ tôi</span>
              </label>

              <a href="#" className="link-forgot">Quên mật khẩu?</a>
            </div>

            <div className="form-group">
              <button className="btn btn--primary btn-login" type="submit" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            Bạn chưa có tài khoản? <Link to="/register" className="auth-link">Đăng Ký</Link>
          </div>
          <div className="auth-note">
            Demo - admin@gmail.com / 123456 | taitranbmt111@gmail.com / 123456
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
