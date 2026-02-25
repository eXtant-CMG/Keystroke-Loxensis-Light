<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="tei" version="2.0">

<xsl:output method="xml" indent="no"/>


<xsl:template match="tei:TEI">
<TEI xmlns="http://www.tei-c.org/ns/1.0">
<xsl:apply-templates/>
</TEI>
</xsl:template>

<!-- deze template voegt het nummer toegekend in de changelist toe in de add in een @n attribute -->
<xsl:template match="tei:add">
<add xmlns="http://www.tei-c.org/ns/1.0"><xsl:copy-of select="@*"/><xsl:attribute name="n"><xsl:value-of select="//tei:change[substring-after(@target,'#') = current()/@evidence]/@n"/></xsl:attribute><xsl:apply-templates/></add></xsl:template>
<xsl:template match="tei:del"><del xmlns="http://www.tei-c.org/ns/1.0"><xsl:copy-of select="@*"/><xsl:attribute name="n"><xsl:value-of select="//tei:change[substring-after(@target,'#') = current()/@evidence]/@n"/></xsl:attribute><xsl:apply-templates/></del></xsl:template>
<xsl:template match="tei:mod"><mod xmlns="http://www.tei-c.org/ns/1.0"><xsl:copy-of select="@*"/><xsl:attribute name="n"><xsl:value-of select="//tei:change[substring-after(@target,'#') = current()/@evidence]/@n"/></xsl:attribute><xsl:apply-templates/></mod></xsl:template>
<xsl:template match="tei:addSpan"><addSpan xmlns="http://www.tei-c.org/ns/1.0"><xsl:copy-of select="@*"/><xsl:attribute name="n"><xsl:value-of select="//tei:change[substring-after(@target,'#') = current()/@evidence]/@n"/></xsl:attribute><xsl:apply-templates/></addSpan></xsl:template>
<xsl:template match="tei:delSpan"><delSpan xmlns="http://www.tei-c.org/ns/1.0"><xsl:copy-of select="@*"/><xsl:attribute name="n"><xsl:value-of select="//tei:change[substring-after(@target,'#') = current()/@evidence]/@n"/></xsl:attribute><xsl:apply-templates/></delSpan></xsl:template>
<xsl:template match="*|@*|comment()|text()">
<xsl:copy>
<xsl:apply-templates select="*|@*|comment()|text()"/>
</xsl:copy>
</xsl:template>
</xsl:stylesheet>