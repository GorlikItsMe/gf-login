import { CertificateStore } from "./utils/CertificateStore";
import { GameforgeClientVersion } from "../types";
import dateFormat from "dateformat";
import { v4 as uuid } from "uuid";
import fetch from "node-fetch";
import { Agent } from "https";

/**
 * @public
 */
export const sendStartTimeEvent = (
    installationId: string,
    clientVersion: GameforgeClientVersion,
    certificateStore: CertificateStore
): Promise<void> => {
    return fetch(`https://events2.gameforge.com/`, {
        method: "POST",
        agent: new Agent({
            pfx: certificateStore.fullCert,
            passphrase: certificateStore.password,
        }),
        headers: {
            "Content-Type": "application/json",
            "User-Agent": `GameforgeClient/${clientVersion.version
                .split(".")
                .slice(0, 3)
                .join(".")}`,
        },
        body: JSON.stringify({
            client_installation_id: installationId,
            client_locale: "usa_eng",
            client_session_id: uuid(),
            client_version_info: {
                branch: clientVersion.branch,
                commit_id: clientVersion.commitId,
                version: clientVersion.version,
            },
            id: 1,
            localtime: dateFormat(new Date(), "isoDateTime"),
            start_count: 1,
            start_time: 7000,
            type: "start_time",
        }),
    }).then(() => undefined);
};
