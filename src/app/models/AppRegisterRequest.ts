export class AppRegisterRequest {
  repoUrl: string;
  repoProject: string;
  appName: string;
  type: string;
  serviceNowQueue: ServiceNowQueue;
  valueStreamGroup: string;
  creatorUpi: string;
}

export class ServiceNowQueue {
  id: string;
  name: string;
}

export class AppRegistrationResponse {
  result: string;
  id: string;
}
