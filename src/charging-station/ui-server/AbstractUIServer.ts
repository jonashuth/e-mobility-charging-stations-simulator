import type { IncomingMessage, Server } from 'http';

import type { ChargingStationData } from '../../types/ChargingStationWorker';
import type { UIServerConfiguration } from '../../types/ConfigurationData';
import {
  AuthenticationType,
  ProcedureName,
  ProtocolRequest,
  ProtocolResponse,
  ProtocolVersion,
  RequestPayload,
  ResponsePayload,
} from '../../types/UIProtocol';
import type AbstractUIService from './ui-services/AbstractUIService';

export abstract class AbstractUIServer {
  public readonly chargingStations: Map<string, ChargingStationData>;
  protected httpServer: Server;
  protected readonly uiServices: Map<ProtocolVersion, AbstractUIService>;

  public constructor(protected readonly uiServerConfiguration: UIServerConfiguration) {
    this.chargingStations = new Map<string, ChargingStationData>();
    this.uiServices = new Map<ProtocolVersion, AbstractUIService>();
  }

  public buildProtocolRequest(
    id: string,
    procedureName: ProcedureName,
    requestPayload: RequestPayload
  ): ProtocolRequest {
    return [id, procedureName, requestPayload];
  }

  public buildProtocolResponse(id: string, responsePayload: ResponsePayload): ProtocolResponse {
    return [id, responsePayload];
  }

  protected isBasicAuthEnabled(): boolean {
    return (
      this.uiServerConfiguration.authentication?.enabled === true &&
      this.uiServerConfiguration.authentication?.type === AuthenticationType.BASIC_AUTH
    );
  }

  protected isValidBasicAuth(req: IncomingMessage): boolean {
    const authorizationHeader = req.headers.authorization ?? '';
    const authorizationToken = authorizationHeader.split(/\s+/).pop() ?? '';
    const authentication = Buffer.from(authorizationToken, 'base64').toString();
    const authenticationParts = authentication.split(/:/);
    const username = authenticationParts.shift();
    const password = authenticationParts.join(':');
    return (
      this.uiServerConfiguration.authentication?.username === username &&
      this.uiServerConfiguration.authentication?.password === password
    );
  }

  public abstract start(): void;
  public abstract stop(): void;
  public abstract sendRequest(request: ProtocolRequest): void;
  public abstract sendResponse(response: ProtocolResponse): void;
  public abstract logPrefix(
    moduleName?: string,
    methodName?: string,
    prefixSuffix?: string
  ): string;
}
