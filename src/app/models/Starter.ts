export class Starter {
  javaVersion: Item;
  bootVersion: Item;
  dependencies: ItemGroup;
}


export class Item {
  values: Value[];
}


export class Value {
  id: string;
  name: string;
  description: string;
}

export class ItemGroup {
  values: Group[];
}

export class Group {
  name: string;
  values: Item[];
}
export class EnterpriseApp {
  name: string;
  commonName: string;
}
