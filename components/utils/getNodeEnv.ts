import getConfig from "next/config";

export const getNodeEnv = () => {
    const { publicRuntimeConfig } = getConfig();
  
    const isProd = publicRuntimeConfig.isProd || false;
    const isStaging = publicRuntimeConfig. isStaging || false;
  
    return { isProd, isStaging }
  };