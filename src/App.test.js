import { fireEvent, render, screen } from '@testing-library/react';
import Product from './components/Product';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

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
describe('2 이벤트 → 의도한 action이 dispatch되는지 / 의도한 호출이 일어나는지', () => {
  const product = {
    id: 1,
    thumbnailUrl: 'test-url',
    name: 'ditto',
    price: 1000,
  };

  test('장바구니 담기 버튼을 클릭하면 장바구니 페이지로 이동해야 한다.', () => {
    // given

    // when
    render(<Product product={product} />);

    const addToCartButton = screen.getByRole('button');
    fireEvent.click(addToCartButton);

    // then
    expect(mockNavigate).toBeCalledWith('/cart');
  });

  test('장바구니 담기 버튼을 클릭하면 상품 추가 요청을 보내야 한다.', () => {
    // given

    // when
    render(<Product product={product} />);

    const addToCartButton = screen.getByRole('button');
    fireEvent.click(addToCartButton);

    // then
    expect(mockDispatch).toBeCalledWith({
      type: 'ADD_PRODUCT',
      payload: product,
    });
  });
});
