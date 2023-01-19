/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
// @ts-ignore
import Rewind from "solid-rewind";

render(
  () => (
    <Rewind>
      <App />
    </Rewind>
  ),
  document.getElementById("root") as HTMLElement
);
