import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectCartStatus,
  selectItems,
  updateCartAsync,
} from './cartSlice';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Grid } from 'react-loader-spinner';
import Modal from '../common/Modal';

export default function Cart() {
  const dispatch = useDispatch();

  const items = useSelector(selectItems);
  const status = useSelector(selectCartStatus);
  const cartLoaded = useSelector(selectCartLoaded)
  const [openModal, setOpenModal] = useState(null);

  const totalAmount = items.reduce(
    (amount, item) => item.product.discountPrice * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({id:item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  return (
    <>
      {!items.length && cartLoaded && <Navigate to="/" replace={true}></Navigate>}

      <div className="max-w-4xl mx-auto mt-12">
        <h1 className="section-title">Your Cart</h1>
        {items.length === 0 ? (
          <div className="card text-center">Your cart is empty.</div>
        ) : (
          <div className="grid gap-6">
            {items.map(item => (
              <div key={item.id} className="card flex flex-col sm:flex-row items-center justify-between">
                <img src={item.product.thumbnail} alt={item.product.title} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0" />
                <div className="flex-1 ml-0 sm:ml-6">
                  <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
                  <p className="text-sm text-gray-500">{item.product.category}</p>
                  <p className="text-sm font-medium text-gray-900">${item.product.discountPrice}</p>
                </div>
                <div className="flex flex-col items-end">
                  <button className="btn-danger mb-2" onClick={(e) => handleRemove(e, item.id)}>Remove</button>
                  <button className="btn-primary" onClick={(e) => handleRemove(e, item.id)}>Checkout</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
