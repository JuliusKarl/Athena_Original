/*https://github.com/Steve-Fenton/TypeScriptUtilities*/
export class Guid {
  public static newGuid() {
    // Trace ID needs to be 16 chars without hyphens as per Open Tracing
    return 'xxxxxxxxxxxx4xxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

