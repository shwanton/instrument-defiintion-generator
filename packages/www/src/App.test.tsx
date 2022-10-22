import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const buttonEl = screen.getByRole("button", { name: /download/i });
  expect(buttonEl).toBeInTheDocument();
});
