export interface ContextProps {
  state: InitialState;
  dispatch: (args: ActionType) => void;
}

export interface InitialState {
  cart: CartItem[];
  products: Product[];
  isHeaderFixed: boolean;
}

export interface CartItem {
  qty: number;
  name: string;
  slug?: string;
  price: number;
  imgUrl?: string;
  id: string | number;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  description?: string;
  imgUrl?: string;
}

interface CartActionType {
  type: "CHANGE_CART_AMOUNT";
  payload: CartItem;
}

interface LayoutActionType {
  type: "TOGGLE_HEADER";
  payload: boolean;
}

interface AddProductActionType {
  type: "ADD_PRODUCT";
  payload: Product;
}

interface RemoveProductActionType {
  type: "REMOVE_PRODUCT";
  payload: string | number;
}

interface UpdateProductActionType {
  type: "UPDATE_PRODUCT";
  payload: Product;
}

export type ActionType =
  | CartActionType
  | LayoutActionType
  | AddProductActionType
  | RemoveProductActionType
  | UpdateProductActionType;