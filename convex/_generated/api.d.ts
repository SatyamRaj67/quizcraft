/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as account from "../account.js";
import type * as password_reset_token from "../password_reset_token.js";
import type * as two_factor_confirmation from "../two_factor_confirmation.js";
import type * as two_factor_token from "../two_factor_token.js";
import type * as user from "../user.js";
import type * as verification_token from "../verification_token.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  account: typeof account;
  password_reset_token: typeof password_reset_token;
  two_factor_confirmation: typeof two_factor_confirmation;
  two_factor_token: typeof two_factor_token;
  user: typeof user;
  verification_token: typeof verification_token;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
