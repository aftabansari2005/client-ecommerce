import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  } from './orderSlice';

export default function Order() {
  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders);

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h1 className="section-title">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="card text-center">No orders found.</div>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.id} className="card">
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
              <div className="mt-2">
                {/* ...order details... */}
              </div>
              <button className="btn-primary mt-4">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
