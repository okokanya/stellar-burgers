import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  getIsOrdersLoading,
  getOrders
} from '../../services/slice/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getOrders);
  const isLoading = useSelector(getIsOrdersLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const getFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={getFeeds} />;
};
