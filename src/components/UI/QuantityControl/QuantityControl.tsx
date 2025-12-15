import React from 'react';
import './QuantityControl.scss';

interface QuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange?: (value: number) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  onChange,
  size = 'medium',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = React.useState<string>(String(quantity));

  React.useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Allow empty string while typing
    if (value === '') {
      return;
    }
    
    // Only allow digits
    const sanitized = value.replace(/[^0-9]/g, '');
    if (sanitized === '') return;
    
    const v = parseInt(sanitized, 10);
    // Only accept positive numbers (> 0)
    if (!Number.isNaN(v) && v > 0 && onChange) {
      onChange(v);
    }
  };

  const handleBlur = () => {
    if (inputValue === '' || parseInt(inputValue, 10) < 1) {
      setInputValue(String(quantity || 1));
    }
  };

  return (
    <div className={`quantity-control quantity-control--${size}`}>
      <button
        className="qty-btn qty-btn--minus"
        onClick={onDecrease}
        disabled={disabled}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="text"
        className="qty-input"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="1"
      />
      <button
        className="qty-btn qty-btn--plus"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};
