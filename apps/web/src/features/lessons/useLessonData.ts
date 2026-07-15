import { useCallback, useEffect, useState } from "react";
import { domainService, getSeriesSnapshot, lessonService } from "../../domain";
export function useLessonData() {
  const [data, setData] =
      useState<Awaited<ReturnType<typeof lessonService.snapshot>>>(),
    [error, setError] = useState("");
  const refresh = useCallback(
    () =>
      domainService
        .ready()
        .then(getSeriesSnapshot)
        .then(() => lessonService.snapshot())
        .then(setData)
        .catch((e: unknown) =>
          setError(
            e instanceof Error
              ? e.message
              : "Stundendaten konnten nicht geladen werden.",
          ),
        ),
    [],
  );
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { data, error, refresh };
}
