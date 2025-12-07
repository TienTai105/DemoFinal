# E-Commerce Application

A modern, fully-featured e-commerce web application built with React 18, TypeScript, and cutting-edge technologies.

## 🚀 Technologies Used

- **Frontend Framework**: React 18 with React Hooks
- **Language**: TypeScript
- **Routing**: React Router DOM v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query) & Axios
- **Forms**: React Hook Form with Yup validation
- **UI Components**: Reactstrap & Bootstrap
- **Styling**: SASS/SCSS
- **Bundler**: Webpack 5
- **Utilities**: classnames, Lucide Icons

## 📋 Features

- ✅ Product listing and filtering
- ✅ Product detail view with ratings and reviews
- ✅ Shopping cart management
- ✅ Checkout with form validation
- ✅ Authentication ready (store setup)
- ✅ Responsive design
- ✅ Modern UI/UX with Bootstrap & SASS
- ✅ Type-safe with TypeScript
- ✅ Efficient data fetching with React Query
- ✅ Centralized state management with Zustand

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── api/              # API integration (Axios, endpoints)
├── components/       # Reusable components
│   ├── Header/      # Header component
│   ├── Footer/      # Footer component
│   ├── ProductCard/ # Product card component
│   ├── ProductList/ # Product list component
│   └── Cart/        # Cart component
├── pages/           # Page components
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   └── CheckoutPage.tsx
├── store/           # Zustand stores
│   ├── cartStore.ts
│   ├── authStore.ts
│   └── filterStore.ts
├── types/           # TypeScript type definitions
├── styles/          # Global SCSS styles
├── App.tsx          # Main app component
├── index.tsx        # Application entry point
└── index.html       # HTML template
```

## 🎨 Component Breakdown

### Header Component
- Navigation menu
- Cart badge with item count
- User authentication status
- Responsive navigation bar

### ProductCard Component
- Product image and details
- Price display with discount
- Star rating and reviews count
- Add to cart button
- Stock status indicator

### Cart Component
- List of cart items
- Quantity adjustment
- Item removal
- Order summary
- Checkout button

### CheckoutPage Component
- Shipping information form
- Payment information form
- Form validation with Yup
- Order summary sidebar
- React Hook Form integration

## 🔌 API Integration

The app uses Axios with interceptors for:
- Request/response handling
- Authentication token management
- Error handling

API endpoints are defined in `src/api/productAPI.ts`

## 🎯 State Management

### Zustand Stores

1. **cartStore.ts** - Shopping cart state
   - Add/remove items
   - Update quantities
   - Calculate totals

2. **authStore.ts** - Authentication state
   - User login/logout
   - Token management

3. **filterStore.ts** - Product filter state
   - Category filters
   - Price range filters

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile (< 576px)
- Tablet (576px - 992px)
- Desktop (> 992px)

## 🔒 Form Validation

Forms use React Hook Form with Yup validation:
- Real-time validation feedback
- Type-safe field definitions
- Custom error messages

## 🚀 Performance Optimizations

- Code splitting with Webpack
- Image optimization with placeholder service
- Efficient re-renders with React Hooks
- Query caching with React Query
- SCSS/CSS extraction for faster loading

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] Payment gateway integration
- [ ] Order tracking
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Admin dashboard
- [ ] Email notifications

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Development

For more information about the technologies used:
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Router Documentation](https://reactrouter.com)
- [Zustand Documentation](https://zustand-demo.vercel.app/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
