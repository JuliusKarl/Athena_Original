export default class BeautifyHelper {

  /**
   * Tries to beautify string as JSON / XML
   *
   * Returns the string as is if the given string is neither JSON nor XML.
   */
  public static beautify(str: string): string {

    if(BeautifyHelper.isJson(str) === true) {
      return BeautifyHelper.beautifyJSON(str);
    }
    else {
      const payloadAsXmlDoc = BeautifyHelper.parseXML(str);

      if(BeautifyHelper.isXML(payloadAsXmlDoc) === true) {
        return BeautifyHelper.beautifyXML(payloadAsXmlDoc);
      }
    }

    return str;
  }

  public static isJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (ignored) { }
    return false;
  }

  public static parseJson(str: string): any {
    return JSON.parse(str);
  }

  public static beautifyJSON(str: string): string {
    return JSON.stringify(JSON.parse(str), null, 2);
  }

  public static isXML(xmlDoc: Document): boolean {
    return xmlDoc.getElementsByTagName('parsererror').length === 0;
  }

  public static parseXML(str: string): Document {
    return new DOMParser().parseFromString(str, 'text/xml');
  }

  public static beautifyXML(xmlDoc: Document): string {
    const xsltDoc = new DOMParser().parseFromString([
      '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
      '  <xsl:strip-space elements="*"/>',
      '  <xsl:template match="para[content-style][not(text())]">',
      '    <xsl:value-of select="normalize-space(.)"/>',
      '  </xsl:template>',
      '  <xsl:template match="node()|@*">',
      '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
      '  </xsl:template>',
      '  <xsl:output indent="yes"/>',
      '</xsl:stylesheet>',
    ].join('\n'), 'application/xml');

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    return new XMLSerializer().serializeToString(resultDoc);
  }
}
