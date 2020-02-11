import {App, AppType, Arch, Dependency, MainApp, RawApp} from '../../models/App';

export class Draw {

  mainApp: RawApp;
  app: App;
  connector: App;
  dependencies: App[] = [];

  CANVAS_WIDTH = 0;
  CANVAS_HEIGHT = 0;
  CANVAS_MID_X = 0;
  CANVAS_MID_Y = 0;

  INBOUND_APP_START_X = 0;
  OUTBOUND_APP_START_X = 0;
  OTHER_APP_START_Y = 0;
  CONSUMER_START_X = 0;
  PRODUCER_START_X = 0;

  topCount = 1;
  bottomCount = 1;

  constructor () {

  }


  getMainApp(rawApp: RawApp) {
    console.log('RawApp ', rawApp);
    this.dependencies = [];
    this.mainApp = rawApp;
    this.initCanvas();

    this.app = new App(rawApp.appName, rawApp.type || AppType.MAIN);
    this.app.posX = this.CANVAS_MID_X;
    this.app.posY = this.CANVAS_MID_Y;

    this.setConnector();
    this.setInboundApps();
    this.setConsumerTopics();
    this.setOutboundApps(this.mainApp.outboundApps, false);
    this.setOutboundApps(this.mainApp.consumers, true);
    this.setProducerTopics();
    this.setOtherApps();

    console.log('dependencies', this.dependencies);

    const mainApp = new MainApp();
    mainApp.app = this.app;
    mainApp.dependencies = this.dependencies;
    return mainApp;
  }


  // Reset the counter for toggling the top, down apps
  resetCounter(): void {
    this.topCount = 1;
    this.bottomCount = 1;
  }


  // Set the positions for kafka sink connector
  setConnector() {
    if ( this.mainApp.sinkConnector) {
      this.connector = new App(this.mainApp.sinkConnector, AppType.KAFKA_SINK_CONNECTOR);
      this.connector.posX = this.CANVAS_MID_X;
      this.connector.posY = this.CANVAS_MID_Y - (3 * Arch.COMPONENT_GAP + Arch.COMPONENT_HEIGHT);
      this.connector.flow = 'in';
      this.connector.standardProperty = true;
      this.dependencies.push(this.connector);
    }
  }

  // Set the positions for inbound apps of type api
  setInboundApps() {
    const apps = this.mainApp.inboundApps && this.mainApp.inboundApps
      .filter(inapp => inapp.type === AppType.API || inapp.type === AppType.CORE)
      .map((inApp, index) => {
        const a = new App(inApp.appName, inApp.type);
        a.posX = this.INBOUND_APP_START_X;
        a.posY = this.YpositionTopBottom(index);
        a.flow = 'in';
        a.standardProperty = inApp.standardProperty;
        return a;
      });
    this.dependencies.push(...apps);
    this.resetCounter();
  }

  // Set the positions for outbound apps of type api
  setOutboundApps(outApps: Dependency[], isConsumer: boolean) {
    const apps = outApps && outApps
      .map((outApp , index) => {
        const a = new App(outApp.appName, outApp.type);
        a.posX = this.OUTBOUND_APP_START_X;
        a.posY = this.YpositionTopBottom(index);
        a.isConsumer = isConsumer;
        a.flow = 'out';
        a.standardProperty = outApp.standardProperty;
        return a;
      });
    this.dependencies.push(...apps);
    this.resetCounter();
  }

  // Set the positions for other type of apps
  setOtherApps() {
    const apps =  this.mainApp.inboundApps && this.mainApp.inboundApps
      .filter(other => other.type !== AppType.API && other.type !== AppType.CORE)
      .map((other, index) => {
        const a = new App(other.appName, other.type);
        a.posX = this.XpositionLeftRight(index);
        a.posY = this.OTHER_APP_START_Y;
        a.flow = 'in';
        a.standardProperty = other.standardProperty;
        return a;
      });
    this.dependencies.push(...apps);
    this.resetCounter();
  }


  // Set the positions for kafka topics
  setConsumerTopics() {
    const apps = this.mainApp.consumerTopics && this.mainApp.consumerTopics
      .map((consumer, index) => {
        // Get the top most inbound application
        let startPos = Math.min.apply(null, this.dependencies
          .filter( (inapp: App) => inapp.type === AppType.API)
          .map( (inapp: App) => inapp.posY));
        startPos = startPos <= this.connector.posY ? startPos : this.connector.posY + (Arch.COMPONENT_GAP + Arch.COMPONENT_HEIGHT) ;
        const a = new App(consumer, AppType.KAFKA_TOPIC);
        a.posX = this.CONSUMER_START_X;
        a.posY = this.YpositionTop(startPos, index + 1);
        a.flow = 'in';
        a.width = Arch.ICON_WIDTH;
        a.height = Arch.ICON_HEIGHT;
        a.standardProperty = true;
        return a;
      });
    this.dependencies.push(...apps);
    this.resetCounter();
  }

  // Set the positions for kafka topics
  setProducerTopics() {
    const apps = this.mainApp.producerTopics && this.mainApp.producerTopics
      .map((producer, index) => {
        // Get the top most inbound application
        let startPos = Math.min.apply(null, this.dependencies
          .filter( (outapp: App) => outapp.flow === 'out')
          .map( (outapp: App) => outapp.posY));
        startPos = (startPos === Infinity) ?  this.CANVAS_MID_Y : startPos;
        const a = new App(producer, AppType.KAFKA_TOPIC);
        a.posX = this.PRODUCER_START_X;
        a.posY = this.YpositionTop(startPos, index + 1);
        a.flow = 'out';
        a.width = Arch.ICON_WIDTH;
        a.height = Arch.ICON_HEIGHT;
        a.standardProperty = true;
        return a;
      });
    this.dependencies.push(...apps);
    this.resetCounter();
  }

  // Calculate the Y position of the app.
  // Toggle position as above the center and below the center.
  YpositionTopBottom(index: number): number {
    let pos;
    if (index === 0) {
      pos = this.CANVAS_MID_Y;
    } else if (index % 2 === 0) {
      pos = this.CANVAS_MID_Y + this.topCount * (Arch.COMPONENT_GAP + Arch.COMPONENT_HEIGHT);
      this.topCount++;
    } else {
      pos = this.CANVAS_MID_Y - this.bottomCount * (Arch.COMPONENT_GAP + Arch.COMPONENT_HEIGHT);
      this.bottomCount++;
    }
    return pos;
  }

  // Calculate the position of the kafka topics
  // All topics are placed one after another
  YpositionTop(startPos: number, index: number): number {
    return startPos - index * (Arch.COMPONENT_GAP + Arch.COMPONENT_HEIGHT);
  }

  // Calculate the X position of the app.
  // Toggle position as left the center and right the center.
  XpositionLeftRight(index: number): number {
    let pos;
    if (index === 0) {
      pos = this.CANVAS_MID_X + Arch.COMPONENT_WIDTH / 2 - Arch.ICON_WIDTH / 2 ;
    } else if (index % 2 === 0) {
      pos = this.CANVAS_MID_X + this.topCount * Arch.ICON_WIDTH;
      this.topCount++;
    } else {
      pos = this.CANVAS_MID_X - this.bottomCount *  Arch.ICON_WIDTH;
      this.bottomCount++;
    }
    return pos;
  }


  // Draw the path based on flow
  getPath(app: App): string {
    if (app.type === AppType.KAFKA_SINK_CONNECTOR) {
      return this.getPathConnector();
    }
    if (app.type === AppType.KAFKA_TOPIC && app.flow === 'in' ) {
      return this.getPathConnectorLeft(app);
    }
    if (app.type === AppType.KAFKA_TOPIC && app.flow === 'out') {
      return this.getPathRight(app);
    }
    if (app.isOther()) {
      return this.getPathDown(app);
    }
    if (app.flow === 'in') {
      return this.getPathLeft(app);
    }
    if (app.flow === 'out') {
      return this.getPathRight(app);
    }
  }

  // Set class as per app
  getAppClass(app: App): string {
    if (app.type === AppType.CORE) {
      return 'core-app';
    }
    if (app.type === AppType.KAFKA_SINK_CONNECTOR) {
      return 'connector-app';
    }
    if (app.type === AppType.KAFKA_TOPIC) {
      return 'queue';
    }
    if (app.flow === 'in') {
      return 'inbound-app';
    }
    if (app.flow === 'out') {
      return 'outbound-app';
    }
    return 'app';
  }

  // Draw the path connecting the left side apps to the main app
  getPathLeft(app: App): string {
    let path = 'M ' + (this.INBOUND_APP_START_X
      + Arch.COMPONENT_WIDTH + (app.isApi()  ? Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS + Arch.ENDPOINT_ARCH_RADIUS  : 0))
      + ' ' + (app.posY + Arch.COMPONENT_HEIGHT / 2);
    path = path  + ' L ' + this.CANVAS_MID_X + ' ' +  (this.CANVAS_MID_Y + Arch.COMPONENT_HEIGHT / 2);
    return path;
  }

  // Draw the path connecting the right side apps to the main app
  getPathRight(app: App): string {
    const appMid = (app.posY  + Arch.COMPONENT_HEIGHT / 2 );

    let path = 'M ' + (this.CANVAS_MID_X + Arch.COMPONENT_WIDTH
      + (this.mainApp.type === AppType.API ? Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS + Arch.ENDPOINT_ARCH_RADIUS : 0)
      + ' ' + (this.CANVAS_MID_Y  + Arch.COMPONENT_HEIGHT / 2 ));
    path = path  + ' L ' + (app.posX -
      (app.isApi() && !app.isConsumer ? Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS + Arch.ENDPOINT_ARCH_RADIUS : 0))
      + ' ' +  appMid;
    return path;
  }

  // Draw the path connecting the bottom side apps to the main app
  getPathDown(app: App): string {
    let path = 'M ' + (this.CANVAS_MID_X + Arch.COMPONENT_WIDTH / 2) + ' ' + (this.CANVAS_MID_Y + Arch.COMPONENT_HEIGHT);
    path = path  + ' L ' + (app.posX + Arch.ICON_WIDTH / 2) + ' ' +  (this.OTHER_APP_START_Y);
    return path;
  }


  // Draw the path connecting the Kafka connect to the main app
  getPathConnector(): string {
    let path = 'M ' + (this.CANVAS_MID_X + Arch.COMPONENT_WIDTH / 2) + ' '
      + (this.CANVAS_MID_Y - Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS - Arch.ENDPOINT_ARCH_RADIUS);
    path = path  + ' L ' + (this.connector.posX + Arch.COMPONENT_WIDTH / 2)
      + ' ' +  (this.connector.posY + Arch.COMPONENT_HEIGHT);
    return path;
  }

  // Draw the path connecting the Kafka connect to the Kafka topics
  getPathConnectorLeft(app: App): string {
    let path  = 'M ' +  this.connector.posX + ' ' + (this.connector.posY + Arch.COMPONENT_HEIGHT / 2);
    path = path  + ' L ' + (this.INBOUND_APP_START_X + Arch.COMPONENT_WIDTH) + ' ' +  (app.posY + Arch.COMPONENT_HEIGHT / 2);

    return path;
  }

  // Draw the API endpoint symbol for the main app to which kafka connector connects
  getConnectorEndPoint(): string {
    const startPoint =  this.CANVAS_MID_Y;
    const appMid = (this.CANVAS_MID_X  + Arch.COMPONENT_WIDTH / 2 );
    let path = 'M ' + appMid + ' ' + startPoint
      + ' L ' + appMid + ' ' + (startPoint - Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS);
    path = path + this.circlePath(appMid, startPoint - Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS , Arch.ENDPOINT_RADIUS);
    return path;
  }
  // Draw the endpoint arch for API endpoint symbol to which kafka connector connects
  getConnectorEndPointArch(): string {
    const startPoint =  this.CANVAS_MID_Y;
    const appMid = (this.CANVAS_MID_X  + Arch.COMPONENT_WIDTH / 2 );
    const archStartY = startPoint - Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS;

    const path = 'M ' + (appMid - Arch.ENDPOINT_ARCH_RADIUS) + ' ' + archStartY
      + ' A ' + Arch.ENDPOINT_ARCH_RADIUS + ' ' + Arch.ENDPOINT_ARCH_RADIUS + ' 0 0 1 '
      + (appMid + Arch.ENDPOINT_ARCH_RADIUS) + ' ' + archStartY;
    return path;
  }

  // Draw the API endpoint symbol
  getEndpoint(app: App): string {
    const appMid = (app.posY  + app.height / 2 );
    let archStartX;
    let startPoint;
    if ( app.flow === 'out' && !app.isConsumer) {
      startPoint = app.posX;
      archStartX = startPoint + (-1 * Arch.ENDPOINT_LINE_MULTIPILER) * Arch.ENDPOINT_RADIUS;
    } else {
      startPoint = app.posX + app.width;
      archStartX = startPoint + Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS;
    }

    let path = 'M ' + startPoint + ' ' + appMid
      + ' L ' + archStartX + ' ' + appMid ;
    path = path + this.circlePath(archStartX , appMid , Arch.ENDPOINT_RADIUS);
    return path;
  }


  // Draw the circle for the API endpoint symbol
  circlePath(cx, cy, r) {
    return 'M ' + cx + ' ' + cy + ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 ' + (r * 2)
      + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
  }

  // Draw the endpoint arch
  getEndpointArch(app: App): string {
    const appMid = (app.posY  + app.height / 2 );
    const flip = app.flow === 'out' ? 0 : 1;
    let archStartX;
    let startPoint;
    if ( app.flow === 'out' && !app.isConsumer) {
      startPoint = app.posX;
      archStartX = startPoint + (-1 * Arch.ENDPOINT_LINE_MULTIPILER) * Arch.ENDPOINT_RADIUS;
    } else {
      startPoint = app.posX + app.width;
      archStartX = startPoint + Arch.ENDPOINT_LINE_MULTIPILER * Arch.ENDPOINT_RADIUS;
    }

    let path = 'M ' + archStartX + ' ' + (appMid - Arch.ENDPOINT_ARCH_RADIUS);
    path = path + ' A ' + Arch.ENDPOINT_ARCH_RADIUS + ' ' + Arch.ENDPOINT_ARCH_RADIUS + ' 0 0 ' + flip + ' '
        + archStartX + ' ' + (appMid + Arch.ENDPOINT_ARCH_RADIUS);

    return path;
  }

  // Add consumer class to outbound app if its a consumer
  getOutboundClass(app: App): string {
    return app.isConsumer ? 'consumer app-link' : 'app-link';
  }


  getQueue(app: App): string {
    let path = 'M ' + app.posX + ' ' + app.posY
    path = path + ' L ' + (app.posX + Arch.COMPONENT_WIDTH) + ' ' + app.posY
    path = path + ' Q ' + (app.posX + Arch.COMPONENT_WIDTH + Arch.COMPONENT_HEIGHT / 2) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT / 2) + ' '
      + (app.posX + Arch.COMPONENT_WIDTH) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT)
    path = path + ' L ' + app.posX  + ' ' + (app.posY + Arch.COMPONENT_HEIGHT)
    path = path + ' Q ' + (app.posX - Arch.COMPONENT_HEIGHT / 2) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT / 2) + ' '
      + app.posX + ' ' + app.posY
    path = path + ' Q ' + (app.posX + Arch.COMPONENT_HEIGHT / 2) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT / 2) + ' '
      + app.posX + ' ' + (app.posY + Arch.COMPONENT_HEIGHT)
    path = path + ' M ' + (app.posX + Arch.COMPONENT_WIDTH) + ' ' + app.posY
    path = path + ' Q ' + (app.posX + Arch.COMPONENT_WIDTH - Arch.COMPONENT_HEIGHT / 2) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT / 2) + ' '
      + (app.posX + Arch.COMPONENT_WIDTH) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT)
    path = path + ' Q ' + (app.posX + Arch.COMPONENT_WIDTH + Arch.COMPONENT_HEIGHT / 2) + ' ' + (app.posY + Arch.COMPONENT_HEIGHT / 2) + ' '
      + (app.posX + Arch.COMPONENT_WIDTH) + ' ' + app.posY + ' Z'
    return path;
  }

  initCanvas() {

    const inboundApps = this.mainApp.inboundApps && this.mainApp.inboundApps.length + 1 || 0;
    const outboundApps = this.mainApp.outboundApps && this.mainApp.outboundApps.length + 1 || 0;
    const maxDependencyCount = inboundApps > outboundApps ? inboundApps : outboundApps;
    const TOPICS_SPACE = this.mainApp.consumerTopics &&
      this.mainApp.consumerTopics.length * (Arch.COMPONENT_HEIGHT + Arch.COMPONENT_GAP / 2) || 0;

    const DEPENDENCY_SPACE = maxDependencyCount * (Arch.COMPONENT_HEIGHT + Arch.COMPONENT_GAP) + TOPICS_SPACE;

    this.CANVAS_WIDTH = window.innerWidth - 50;
    this.CANVAS_HEIGHT = window.innerHeight - 150;
    this.CANVAS_HEIGHT = this.CANVAS_HEIGHT > DEPENDENCY_SPACE ? this.CANVAS_HEIGHT : DEPENDENCY_SPACE;
    console.log(this.CANVAS_HEIGHT)
    this.CANVAS_MID_X = this.CANVAS_WIDTH / 2 - Arch.COMPONENT_WIDTH / 2 + Arch.DETAILS_BLOCK_OFFSET;
    // All topics are always placed on the top of the main app
    this.CANVAS_MID_Y = this.CANVAS_HEIGHT / 2 - Arch.COMPONENT_HEIGHT / 2  + TOPICS_SPACE;

    this.INBOUND_APP_START_X = this.CANVAS_MID_X - 300;
    this.OUTBOUND_APP_START_X = this.CANVAS_MID_X + 300;
    this.CONSUMER_START_X = this.CANVAS_MID_X - 300;
    this.PRODUCER_START_X = this.CANVAS_MID_X + 300;
    this.OTHER_APP_START_Y = this.CANVAS_MID_Y + 150;
  }
}
