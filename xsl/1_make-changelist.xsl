<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="tei" version="2.0">

<xsl:output method="xml" indent="no"/>

<xsl:template match="/">
<xsl:apply-templates/>
</xsl:template>

<xsl:template match="tei:TEI">
<TEI xmlns="http://www.tei-c.org/ns/1.0">
<xsl:apply-templates/>
</TEI>
</xsl:template>

<!-- deze template kijkt eerst of je al een profileDesc hebt in je header,
en wanneer dat niet het geval is, maakt hij in de teiHeader volgende tags aan:

<profileDesc>
	<creation>
		<listChange>
			...
		</listChange>
	</creation>
</profileDesc>

 en roept daarna de template genaamd "CollectChanges" aan, die verder 
 de lijst van de veranderingen maakt
-->
<xsl:template match="tei:teiHeader">
<teiHeader xmlns="http://www.tei-c.org/ns/1.0">
	<xsl:if test="tei:profileDesc"><xsl:apply-templates/></xsl:if>
	<xsl:if test="not(tei:profileDesc)">
		<xsl:apply-templates/>
		<profileDesc>
			<creation>
				<listChange>
					<xsl:call-template name="CollectChanges"/>
				</listChange>
			</creation>
		</profileDesc>
	</xsl:if>
</teiHeader>
</xsl:template>

<!-- wanneer je al een profileDesc zou hebben, zet deze template er de nodige tags nog bij-->
<xsl:template match="tei:profileDesc">
<profileDesc xmlns="http://www.tei-c.org/ns/1.0">
	<xsl:apply-templates/>
	<creation>
		<listChange>
			<xsl:call-template name="CollectChanges"/>
		</listChange>
	</creation>
	</profileDesc>			
</xsl:template>

<!-- deze template maakt voor elk element dat een @seq heeft, een <change> element,
sorteert deze op basis van de waarde van @seq (dus chronologisch), zet in een @target
de verwijzing naar de identifier uit @evidence, en voegt een nummer toe in een @n -->
<xsl:template name="CollectChanges">
<xsl:for-each select="//*[@seq]">
	<xsl:sort select="@seq"/>
	<change xmlns="http://www.tei-c.org/ns/1.0"><xsl:attribute name="target"><xsl:value-of select="concat('#',@evidence)"/></xsl:attribute><xsl:attribute name="n"><xsl:value-of select="position()"/></xsl:attribute></change>
</xsl:for-each>
</xsl:template>

<xsl:template match="tei:*|@*|comment()|text()">
<xsl:copy>
<xsl:apply-templates select="tei:*|@*|comment()|text()"/>
</xsl:copy>
</xsl:template>
</xsl:stylesheet>