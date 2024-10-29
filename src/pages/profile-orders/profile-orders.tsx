import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchGetAllUserOreders,
  getUserOrders
} from '../../services/slice/feed';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getUserOrders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetAllUserOreders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
