export class RepoDetails {
  name: string;
  project: Project;
  htmlUrl: string;
  cloneSshUrl: string;
}

class Project {
  name: string;
  htmlUrl: string;
}
