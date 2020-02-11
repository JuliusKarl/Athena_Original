export class KafkaInfo {
  version: string;
  brokers: KafkaBroker[];
  topics: number;
  consumers: number;
}
export class KafkaBroker {
  id: number;
  host: string;
  port: number;
}
export class KafkaPartition {
  partition: number;
  leader: string;
  offset: KafkaOffset;
}

export class KafkaOffset {
  partition: number;
  start: number;
  end: number;
  size: number;
  current: number;
  lag: number;
}
export class ResetOffset {
  topic: string;
  partition: number;
  offset: number;
}
export class KafkaPartitionData {
  offset: number;
  key: number;
  message: number;
  timestamp: number;
}

export class KafkaConsumer {
  consumerName: string;
  partitions: ConsumerPartition[];
}
export class ConsumerPartition {
  topic: string;
  partition: number;
  offsets: KafkaOffset;
}

/** Data class that represents a summary of all Kafka Connectors */
export class KafkaConnectorsSummary {
  version: string;
  sourceConnectors: number;
  sinkConnectors: number;
  taskHealth: Map<KafkaConnectorType, Map<KafkaConnectorTaskStatus, number>>;
}

export enum KafkaConnectorType {
  SOURCE,
  SINK
}

/** Data class that represents a Kafka Connector */
export class KafkaConnector {
  name: string;
  type: string;
  health: KafkaConnectorHealth;
  config: Map<string, string>;
}

/** Data class that represents the state of a Kafka Connector */
export class KafkaConnectorHealth {
  state: KafkaConnectorStatus;
  tasks: KafkaConnectorTask[];
}

/** Data class that represents the state of a Kafka Connector Task */
export class KafkaConnectorTask {
  taskId: number;
  state: KafkaConnectorTaskStatus;
  trace: string;
}

/** Data class that represents an Integration API */
export class IntegrationApi {
  url: string;
}

/** Enum that lists the possible statuses of a Kafka Connector */
export enum KafkaConnectorStatus {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  DELETED = 'DELETED'
}

/** Enum that lists the possible statuses of a Kafka Connector Task*/
export enum KafkaConnectorTaskStatus {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FAILED = 'FAILED'
}

/** Available actions on a Kafka Connector */
export enum KafkaConnectorAction {
  PAUSE = 'PAUSE',
  RESUME = 'RESUME',
  RESTART = 'RESTART'
}

/** Available actions on a Kafka Connector Task */
export enum KafkaConnectorTaskAction {
  RESTART = 'RESTART'
}

/**
 * State shared across Kafka Connect components src/app/kafka/kafka-connect/*
 * This state represents the update of a Kafka Connector
 */
export class KafkaConnectStateUpdatedConnector {
  name: string;
  newStatus: KafkaConnectorStatus;
}

/**
 * State shared across Kafka Connect components src/app/kafka/kafka-connect/*
 * This state represents the update of a Kafka Connector Task
 */
export class KafkaConnectStateUpdatedTask {
  id: number;
  connectorName: string;
  newStatus: KafkaConnectorTaskStatus;
}

/**
 * Response from REST call to POST /resetOffset
 */
export class ResetOffsetResponse {
  operations: ResetOffsetOperation[]
}

export class ResetOffsetOperation {
  /* Technical name of the operation */
  name: string;
  /** Http Status reason phrase */
  status: string;
  /** Message explaining what went right/wrong */
  message: string;
}
