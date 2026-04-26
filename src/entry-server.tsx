import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "./App.tsx";
import { StoreProvider } from "./store.tsx";

export function render(url: string) {
  return renderToString(
    <StoreProvider>
      <MemoryRouter initialEntries={[url]}>
        <AppRoutes />
      </MemoryRouter>
    </StoreProvider>,
  );
}
