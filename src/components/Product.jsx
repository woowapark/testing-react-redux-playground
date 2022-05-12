import React from 'react';

const Product = ({ product }) => {
  const { name, price, thumbnailUrl } = product;

  return (
    <>
      <img src={thumbnailUrl} alt="product-thumbnail" />
      <p>{name}</p>
      <p>{price}</p>
      <button type="button">장바구니 담기</button>
    </>
  );
};

export default Product;
