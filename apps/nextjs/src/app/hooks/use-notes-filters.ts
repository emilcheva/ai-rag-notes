import { useQueryStates } from "nuqs";

const DEFAULT_PAGE = 1;

export const useNotesFilters = () => {
  return useQueryStates(
    {
      page: {
        defaultValue: DEFAULT_PAGE,
        parse: (value: string) => {
          const parsed = Number(value);
          return isNaN(parsed) || parsed < 1 ? DEFAULT_PAGE : parsed;
        },
      },
    },
    { clearOnDefault: true },
  );
};
