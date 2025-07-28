import { parseAsInteger, useQueryStates } from "nuqs";

const DEFAULT_PAGE = 1;

export const useNotesFilters = () => {
  return useQueryStates({
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
  });
};
