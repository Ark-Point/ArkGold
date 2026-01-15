import * as Joi from "joi";
import { Environment } from "../constant/environment";

export function validateSchema() {
  return Joi.object({
    NODE_ENV: Joi.string().valid(...Object.values(Environment)),
    APP_ORIGIN: Joi.string().required(),
    REOWN_PROJECT_ID: Joi.string().required(),
    // Mantle
    MANTLE_RPC_URL: Joi.string().required(),
    MANTLE_WSS_URL: Joi.string().required(),
    MANTLE_CHAIN_ID: Joi.number().required(),
    // ETH
    ETH_RPC_URL: Joi.string().required(),
    ETH_WSS_URL: Joi.string().required(),
    ETH_CHAIN_ID: Joi.number().required(),

    ADMIN_WALLET_KEY: Joi.string().required(),
    ADMIN_WALLET_ADDRESS: Joi.string().required(),
  });
}
