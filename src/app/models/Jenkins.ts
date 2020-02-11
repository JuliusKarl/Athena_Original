export class JobDetails {
  url: string;
  healthReport: HealthReport;
}
class HealthReport {
  description: string;
  score: number;
}

export class QueueDetails {
  id: number;
  executable: Executable;
}
class Executable {
  number: number;
  url: string;
}

export class BuildDetails {
  queueId: number;
}
