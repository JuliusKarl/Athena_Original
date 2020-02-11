export enum AppType {
  MAIN = 'main',
  CORE = 'core',
  API = 'api',
  INTEGRATION = 'integration',
  KAFKA_SINK_CONNECTOR = 'kafka sink connector',
  KAFKA_TOPIC = 'topic',
  UNKNOWN = 'unknown'
}
export namespace AppType {

  export const ALL_VALUES = Object.values(AppType);

  export function from(val: string): AppType {
    if(!val) {
      return AppType.UNKNOWN;
    }

    const found = ALL_VALUES.indexOf(val.toLowerCase());

    return ALL_VALUES[found] || AppType.UNKNOWN;
  }
}

export class Arch {
  static DETAILS_BLOCK_OFFSET = 150;
  static COMPONENT_WIDTH = 200;
  static COMPONENT_HEIGHT = 50;
  static COMPONENT_PAD = 10;
  static COMPONENT_GAP = 50;
  static ACTION_ICON_WIDTH = 15;
  static ICON_WIDTH = 50;
  static ICON_HEIGHT = 50;
  static ENDPOINT_RADIUS = 6;
  static ENDPOINT_LINE_MULTIPILER = 3;
  static ENDPOINT_ARCH_RADIUS = 10;
}

/**
 * Represents an application as defined in the app-meta index.
 *
 * Typescript equivalent of Athena Backend > AppMetaData.java
 */
export class RawApp {
  appName: string;
  type: string;
  contextPath: string;
  inboundApps: Dependency[] = [];
  outboundApps: Dependency[] = [];
  consumers: Dependency[] = [];
  consumerTopics: string[] = [];
  producerTopics: string[] = [];
  consumerGroup: string;
  sinkConnector: string;
  sourceConnector: string;
  serviceNowQueue: ServiceNowQueue;
  valueStreamGroup: string;
  repoUrl: string;
  repoProject: string;
  wikiUrl: string;
  specUrl: string;
  lastBuildUrl: string;
  creatorUpi: string;
  creationTime: string;
}

/**
 * Represents a ServiceNow Queue
 *
 * Typescript equivalent of Athena Backend > ServiceNowQueue.java
 */
export class ServiceNowQueue {
  name: string;
  id: string;
}

/**
 * Represents an application dependency.
 *
 * Typescript equivalent of Athena Backend > Dependency.java
 */
export class Dependency {
  appName: string;
  propertyKey: string;
  propertyValue: string;
  type: string;
  standardProperty: boolean;
  isConsumer: boolean;
}

export class MainApp {
  app: App;
  dependencies: App[];
}

export class App {
  appName: string;
  type: string;
  posX: number;
  posY: number;
  height: number;
  width: number;
  textPad: number;
  isConsumer: boolean;
  flow: string;
  standardProperty: boolean;

  constructor(appName: string, type: string) {
    this.appName = appName || AppType.UNKNOWN;
    this.type = type || AppType.UNKNOWN;
    this.height = Arch.COMPONENT_HEIGHT;
    this.width = Arch.COMPONENT_WIDTH;
    this.textPad = Arch.COMPONENT_PAD;
  }

  titleX() {
    if (this.isOther()) {
      return this.posX + (Arch.ICON_WIDTH / 2) -  this.appName.length * 4;
    } else {
      return this.posX + this.textPad;
    }
  }
  titleY() {
    if (this.isOther()) {
      return this.posY + Arch.ICON_HEIGHT +  2 * this.textPad;
    } else {
      return this.posY + this.height / 2 ;
    }
  }
  subTitleX() {
    return this.posX + this.textPad;
  }
  subTitleY() {
    if (this.isOther()) {
      return this.posY + Arch.ICON_HEIGHT +  3.5 * this.textPad;
    } else {
      return this.posY + this.height - this.textPad ;
    }
  }

  getActions(): Action[] {
    const actions = [];
    if (!this.standardProperty) {
      const action = new Action();
      action.icon = 'non-std.png';
      action.toolTip = 'This component was derived from non-standard property in main application';
      actions.push(action);
    }

    const configLink = this.getConfigLink();
    if (configLink) {
      const action = new Action();
      action.icon = 'config.png';
      action.toolTip = 'View ' + this.appName + ' configuration';
      action.link = configLink;
      actions.push(action);
    }
    return actions;
  }

  actionsX(idx: number) {
    return this.posX + (Arch.ACTION_ICON_WIDTH + this.textPad ) * idx;
  }
  actionsY() {
    return this.posY + this.height +  this.textPad / 2 ;
  }

  private getConfigLink() {
    let link = null;
    if ( this.type === AppType.KAFKA_TOPIC ) {
      link = '/kafka/topics/' + this.appName;
    }
    if ( this.type === AppType.KAFKA_SINK_CONNECTOR ) {
      link = '/kafka/connect/' + this.appName;
    }

    return link;
  }

  iconWidth() {
    return Arch.ICON_WIDTH;
  }
  iconHeight() {
    return Arch.ICON_HEIGHT;
  }
  isCore() {
    return this.type === AppType.CORE;
  }
  isApi() {
    return this.type === AppType.API;
  }
  isIntegration() {
    return this.type === AppType.INTEGRATION;
  }
  isConnector() {
    return this.type === AppType.KAFKA_SINK_CONNECTOR;
  }
  isQueue() {
    return this.type === AppType.KAFKA_TOPIC;
  }
  isOther() {
    return AppType.ALL_VALUES.indexOf(this.type.toLowerCase()) === -1;
  }
}

export class Action {
  icon: string;
  toolTip: string;
  link: string;
}
