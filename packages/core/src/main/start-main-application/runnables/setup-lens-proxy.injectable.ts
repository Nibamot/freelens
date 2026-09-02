/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { beforeApplicationIsLoadingInjectionToken } from "@nibamot/application";
import { loggerInjectionToken } from "@nibamot/logger";
import { getInjectable } from "@ogre-tools/injectable";
import fetchInjectable from "../../../common/fetch/fetch.injectable";
import { lensProxyDispatcherInjectionToken } from "../../../common/fetch/lens-proxy-dispatcher-injection-token";
import isProductionInjectable from "../../../common/vars/is-production.injectable";
import isWindowsInjectable from "../../../common/vars/is-windows.injectable";
import { buildVersionInitializable } from "../../../features/vars/build-version/common/token";
import { buildVersionInitializationInjectable } from "../../../features/vars/build-version/main/init.injectable";
import forceAppExitInjectable from "../../electron-app/features/force-app-exit.injectable";
import showErrorPopupInjectable from "../../electron-app/features/show-error-popup.injectable";
import lensProxyInjectable from "../../lens-proxy/lens-proxy.injectable";
import lensProxyPortInjectable from "../../lens-proxy/lens-proxy-port.injectable";
import setupLensProxyCertificateInjectable from "./setup-lens-proxy-certificate.injectable";

import type { MainFetch } from "../../fetch/main-fetch-request-init";

const setupLensProxyInjectable = getInjectable({
  id: "setup-lens-proxy",

  instantiate: (di) => ({
    run: async () => {
      const lensProxy = di.inject(lensProxyInjectable);
      const forceAppExit = di.inject(forceAppExitInjectable);
      const logger = di.inject(loggerInjectionToken);
      const lensProxyPort = di.inject(lensProxyPortInjectable);
      const isWindows = di.inject(isWindowsInjectable);
      const showErrorPopup = di.inject(showErrorPopupInjectable);
      const buildVersion = di.inject(buildVersionInitializable.stateToken);
      const lensProxyDispatcher = di.inject(lensProxyDispatcherInjectionToken);
      const fetch: MainFetch = di.inject(fetchInjectable);
      const isProduction = di.inject(isProductionInjectable);

      try {
        logger.info("🔌 Starting IMS-Scope Proxy");
        await lensProxy.listen(); // lensProxy.port available
      } catch (error: any) {
        showErrorPopup("IMS-Scope Error", `Could not start proxy: ${error?.message || "unknown error"}`);

        return forceAppExit();
      }

      // test proxy connection
      try {
        logger.info("🔎 Testing IMS-Scope Proxy connection ...");
        const versionResponse = await fetch(`https://127.0.0.1:${lensProxyPort.get()}/version`, {
          dispatcher: lensProxyDispatcher(),
        });

        const { version: versionFromProxy } = (await versionResponse.json()) as { version: string };

        if (buildVersion !== versionFromProxy) {
          logger.error("Proxy server responded with invalid response");

          return forceAppExit();
        }

        logger.info("⚡ IMS-Scope Proxy connection OK");
      } catch (error) {
        logger.error(`🛑 IMS-Scope Proxy: failed connection test: ${error}`);

        const hostsPath = isWindows ? "C:\\windows\\system32\\drivers\\etc\\hosts" : "/etc/hosts";
        const message = [
          `Failed connection test: ${error}`,
          "Check to make sure that no other versions of IMS-Scope are running",
          `Check ${hostsPath} to make sure that it is clean and that the localhost loopback is at the top and set to 127.0.0.1`,
          "If you have HTTP_PROXY or http_proxy set in your environment, make sure that the localhost and the ipv4 loopback address 127.0.0.1 are added to the NO_PROXY environment variable.",
        ];

        showErrorPopup("IMS-Scope Proxy Error", message.join("\n\n"));

        return forceAppExit();
      }

      // Wait for the renderer route to be ready (prevents ERR_EMPTY_RESPONSE race condition)
      const maxAttempts = 30;
      const retryDelayMs = 200;
      const testPath = isProduction ? "/" : "/build/index.html";

      logger.info(`🔧 Waiting for renderer route to be ready (${testPath})...`);

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          // Test the actual route that the window will load
          const response = await fetch(`https://127.0.0.1:${lensProxyPort.get()}${testPath}`, {
            method: "HEAD",
            dispatcher: lensProxyDispatcher(),
            signal: AbortSignal.timeout(2000),
          });

          if (response.ok) {
            logger.info("⚡ Renderer route is ready");
            break;
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error: any) {
          if (attempt < maxAttempts) {
            logger.info(
              `🔧 Renderer route not ready yet (attempt ${attempt}/${maxAttempts}): ${error.message}, retrying in ${retryDelayMs}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
          } else {
            logger.warn(
              `⚠️  Renderer route did not respond after ${maxAttempts} attempts (${error.message}). Window may fail to load initially.`,
            );
          }
        }
      }
    },
    runAfter: [buildVersionInitializationInjectable, setupLensProxyCertificateInjectable],
  }),

  causesSideEffects: true,

  injectionToken: beforeApplicationIsLoadingInjectionToken,
});

export default setupLensProxyInjectable;
