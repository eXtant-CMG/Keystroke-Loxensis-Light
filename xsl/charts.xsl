

<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="tei">

  <xsl:output method="html" encoding="UTF-8"/>

  <xsl:template match="/">

    <section class="session-chart"

      data-add-nt="{count(//tei:add[@type='nt'])}"
      data-mod-continue="{count(//tei:mod[@type='continue'])}"
      data-del-typo="{count(//tei:del[@type='typo'])}"
      data-add-typo="{count(//tei:add[@type='typo'])}"
      data-del-context="{count(//tei:del[@type='context'])}"
      data-add-context="{count(//tei:add[@type='context'])}"
      data-del-precontext="{count(//tei:del[@type='pre-context'])}"
      data-add-precontext="{count(//tei:add[@type='pre-context'])}"
      data-add-translocation="{count(//tei:add[@type='translocation'])}"
    >
      <canvas></canvas>

    </section>

  </xsl:template>

</xsl:stylesheet>

