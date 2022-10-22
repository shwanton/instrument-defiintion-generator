import {
  type Config,
  type State,
  genDefinitionText,
} from "@packages/generator";
import { useCallback } from "react";

export function useCreateFileDownload(
  config: Config,
  state: State,
  ref: React.RefObject<HTMLAnchorElement>
): (e: React.MouseEvent<HTMLElement>) => void {
  return useCallback(
    (e) => {
      e.preventDefault();

      if (ref.current == null) {
        return;
      }

      const text = genDefinitionText(config, state);

      const blob = new Blob([text], { type: "text/plain" });

      const fileDownloadUrl = URL.createObjectURL(blob);

      ref.current.setAttribute("href", fileDownloadUrl);
      ref.current.setAttribute("download", state.filename ?? "default.txt");

      ref.current?.click();

      URL.revokeObjectURL(fileDownloadUrl);
    },
    [config, state, ref]
  );
}
