import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./ShippingPage.scss";
import { ChevronRight } from "lucide-react";

const ShippingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPreviousPage = () => {
    const state = location.state as any;
    if (state?.from) return state.from;
    const prevPage = sessionStorage.getItem('previousPage');
    if (prevPage) return JSON.parse(prevPage);
    return { name: 'Trang Chủ', path: '/' };
  };

  const previousPage = getPreviousPage();

  useEffect(() => {
    return () => {
      sessionStorage.setItem('previousPage', JSON.stringify({ name: 'Vận Chuyển & Giao Hàng', path: '/shipping' }));
    };
  }, []);

  return (
    <div className="shipping-page">
      <div className="shipping-container">
        {/* ===== HEADER ===== */}
        <div className="shipping-header">
          <div className="breadcrumb-top">
            <button 
              className="breadcrumb-link"
              onClick={() => navigate(previousPage.path === '/' ? '/' : previousPage.path, { state: { from: null } })}
            >
              {previousPage.name}
            </button>
            <span className="breadcrumb-sep"><ChevronRight size={18} /></span>
            <span className="breadcrumb-current">Vận Chuyển & Giao Hàng</span>
          </div>

          <h1 className="page-title">Vận Chuyển & Giao Hàng</h1>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="shipping-body">
          <section>
            <h3>Thời Gian Xử Lý</h3>
            <p>
              Tất cả các đơn hàng được xử lý trong vòng 1-2 ngày làm việc. Các đơn hàng đặt vào cuối tuần hoặc ngày lễ sẽ được xử lý vào ngày làm việc tiếp theo. Khi đơn hàng của bạn được gửi đi, bạn sẽ nhận được email xác nhận kèm chi tiết theo dõi.
            </p>
          </section>

          <section>
            <h3>Thời Gian Giao Hàng</h3>
            <p>
              Thời gian giao hàng tùy thuộc vào vị trí của bạn và tùy chọn vận chuyển được chọn. Vận chuyển tiêu chuẩn thường mất 5-10 ngày làm việc, trong khi các tùy chọn nhanh hơn có thể đến trong 2-5 ngày. Những ước tính này có thể thay đổi tùy theo điểm đến và khả năng của nhà cung cấp.
            </p>
          </section>

          <section>
            <h3>Theo Dõi Đơn Hàng Của Bạn</h3>
            <p>
              Khi đơn hàng của bạn được gửi đi, bạn sẽ nhận được liên kết theo dõi để giám sát tiến độ giao hàng. Vui lòng chờ đến 24 giờ để cập nhật theo dõi xuất hiện sau khi gửi hàng.
            </p>
          </section>

          <section>
            <h3>Chi Phí Vận Chuyển</h3>
            <p>
              Chi phí vận chuyển được tính toán tại thanh toán và tùy thuộc vào vị trí và phương thức giao hàng được chọn của bạn. Chúng tôi thỉnh thoảng cung cấp vận chuyển miễn phí trong các kỳ khuyến mãi.
            </p>
          </section>

          <section>
            <h3>Độ Trễ và Ngoại Lệ</h3>
            <p>
              Những hoàn cảnh không lường trước như điều kiện thời tiết, thủ tục hải quan hoặc độ trễ của nhà cung cấp có thể ảnh hưởng đến thời gian giao hàng. Chúng tôi trân trọng sự kiên nhẫn và thông cảm của bạn trong những trường hợp như vậy.
            </p>
          </section>

          <section>
            <h3>Cần Giúp Đỡ?</h3>
            <p>
              Nếu bạn chưa nhận được đơn hàng trong khung thời gian dự kiến hoặc nhận thấy bất kỳ vấn đề nào với việc giao hàng, hãy liên hệ với đội ngũ của chúng tôi tại support@nhom7.com kèm theo số đơn hàng của bạn — chúng tôi sẽ hỗ trợ bạn sớm nhất có thể.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
