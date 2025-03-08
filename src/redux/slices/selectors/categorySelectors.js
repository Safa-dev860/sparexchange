// src/selectors/categorySelectors.js
import { createSelector } from "@reduxjs/toolkit";

// Base selectors for each category
const selectProducts = (state) => state.products?.items || [];
const selectExchange = (state) => state.exchange?.items || [];
const selectDone = (state) => state.done?.items || [];
const selectFreelance = (state) => state.freelance?.items || [];
const selectTransport = (state) => state.transport?.items || [];

// Memoized combined selector for all categories
export const selectAllCategories = createSelector(
  [
    selectProducts,
    selectExchange,
    selectDone,
    selectFreelance,
    selectTransport,
  ],
  (products, exchange, done, freelance, transport) => ({
    products,
    exchange,
    done,
    freelance,
    transport,
  })
);

// Memoized selector for combined loading state
export const selectCategoriesLoading = createSelector(
  [
    (state) => state.products?.loading,
    (state) => state.exchange?.loading,
    (state) => state.done?.loading,
    (state) => state.freelance?.loading,
    (state) => state.transport?.loading,
  ],
  (
    productsLoading,
    exchangeLoading,
    doneLoading,
    freelanceLoading,
    transportLoading
  ) =>
    productsLoading ||
    exchangeLoading ||
    doneLoading ||
    freelanceLoading ||
    transportLoading
);

// Memoized selector for combined error state
export const selectCategoriesError = createSelector(
  [
    (state) => state.products?.error,
    (state) => state.exchange?.error,
    (state) => state.done?.error,
    (state) => state.freelance?.error,
    (state) => state.transport?.error,
  ],
  (productsError, exchangeError, doneError, freelanceError, transportError) =>
    productsError ||
    exchangeError ||
    doneError ||
    freelanceError ||
    transportError
);
