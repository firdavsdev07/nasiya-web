/* eslint-disable import/no-extraneous-dependencies */
import type { AppDispatch } from "src/store";

import { useDispatch } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
