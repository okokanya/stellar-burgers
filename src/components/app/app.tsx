import { useEffect } from 'react';
import '../../index.css';
import styles from './app.module.css';
import ProtectedRoute from '../ProtectedRoute';
import { fetchIngredients } from '../../services/slice/ingredients';

import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Profile,
  Register,
  ForgotPassword,
  ResetPassword,
  ProfileOrders
} from '@pages';
import { useDispatch } from '../../services/store';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  const navigate = useNavigate();
  const goBack = () => {
    console.log('go back');
    navigate(-1);
  };


  useEffect(() => {
    // dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);



  return (
    <div className={styles.app}>
      <AppHeader />
      {/* <BrowserRouter> */}
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='*'
          element={
            <ProtectedRoute>
              <NotFound404 />
            </ProtectedRoute>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Modal title={`Заказ`} onClose={goBack}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={goBack}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title='Заказ' onClose={goBack}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
      {/* </BrowserRouter> */}
    </div>
  );
};

export default App;
