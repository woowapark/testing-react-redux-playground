import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, price, thumbnailUrl } = product;

  const handleClick = () => {
    navigate('/cart');
    dispatch({
      type: 'ADD_PRODUCT',
      payload: {
        ...product,
      },
    });
  };

  return (
    <>
      <img src={thumbnailUrl} alt="product-thumbnail" />
      <p>{name}</p>
      <p>{price}</p>
      <button type="button" onClick={handleClick}>
        장바구니 담기
      </button>
    </>
  );
};

export default Product;
