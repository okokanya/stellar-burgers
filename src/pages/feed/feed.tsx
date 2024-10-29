import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchGetAllOreders, getOrders } from '../../services/slice/feed';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetAllOreders());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  } else
    return (
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchGetAllOreders());
        }}
      />
    );
};
