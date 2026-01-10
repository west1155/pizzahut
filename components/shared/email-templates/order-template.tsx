import React from 'react';

interface Props {
    orderId: number;
    totalAmount: number;
    items: any[];
}

export const OrderTemplate: React.FC<Props> = ({ orderId, totalAmount, items }) => (
    <div>
        <h1>Order #{orderId}</h1>
        <p>Thank you for your order! Here are the details:</p>
        <hr />
        <ul>
            {items.map((item) => (
                <li key={item.id}>
                    {item.productItem.product.name} | {item.productItem.price} £ x {item.quantity} шт. = {item.productItem.price * item.quantity} £
                </li>
            ))}
        </ul>
        <hr />
        <p><b>Total Amount: {totalAmount} £</b></p>
    </div>
);
