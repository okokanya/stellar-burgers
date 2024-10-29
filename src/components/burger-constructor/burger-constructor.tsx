import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { purgeIngredients } from '../../services/slice/constructor';
import {
  makeOrder,
  resetOrder,
  getOrderRequest,
  getOrder,
  clearOrderModalData
} from '../../services/slice/order';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/slice/user';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector((state) => state.constructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrder);
  const user = useSelector(getUser);

  const onOrderClick = () => {
    if (!constructorItems || orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    const bunId = constructorItems.bun!._id;
    const ids = constructorItems.ingredients.map(
      (ingredient: TIngredient) => ingredient._id
    );
    const ingredients = [bunId, ...ids, bunId];

    dispatch(makeOrder(ingredients)).then(() => {
      dispatch(purgeIngredients());
    });
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(clearOrderModalData());
    navigate('/');
  };
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
