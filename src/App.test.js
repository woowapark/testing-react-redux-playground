import { render, screen } from '@testing-library/react';

describe('1 컴포넌트 렌더 테스트', () => {
  test('상품 컴포넌트는 썸네일, 상품 이름, 가격, 장바구니 담기 버튼을 렌더해야 한다.', () => {
    // given
    const product = {
      id: 1,
      thumbnailUrl: 'test-url',
      name: 'ditto',
      price: 1000,
    };

    // when
    render(<Product product={product} />);

    // then
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(product.price)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      product.thumbnailUrl
    );
    expect(screen.getByRole('button')).toHaveTextContent('장바구니 담기');
  });
});
