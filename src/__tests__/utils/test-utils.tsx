import { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import userReducer from "@/store/slices/userSlice";

export function renderWithProviders(
  ui: ReactElement,
  renderOptions: Omit<RenderOptions, "wrapper"> = {}
) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from "@testing-library/react";
