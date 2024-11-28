import { createTypedHooks } from "easy-peasy";
import { ProductModel } from "../Store/models/productModel";

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<{
    product: ProductModel;
  }>();

export { useStoreActions, useStoreState, useStoreDispatch, useStore };
