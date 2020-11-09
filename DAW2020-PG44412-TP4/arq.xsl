<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">

    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html>
                <head>
                    <title>Arqueossítios do NW Português</title>
                </head>

                <body
                    style="margin:0px;padding:0px;font-family:Arial;font-size:12pt;background-color:#EEEEEE">
                    <header style="padding:10px;background-color:#100E17;text-align:center">
                        <h1 style="color:#FF8A00">Arqueossítios do NW Português</h1>
                        <h2 style="color:#FFFFFF">Índice de Arqueossítios</h2>
                    </header>

                    <main style="margin-left:100px">
                        <ol>
                            <xsl:apply-templates select="ARQSITS" mode="indice"/>
                        </ol>
                    </main>

                    <footer style="padding:10px;background-color:#100E17;text-align:center">
                        <span style="color:#FFFFFF">
                            <xsl:value-of
                                select="format-dateTime(current-dateTime(), 'Página gerada em: [D01]/[M01]/[Y0001] [H01]:[m01]')"
                            />
                        </span>
                    </footer>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>

    <!-- Índice -->
    <xsl:template match="ARQSITS" mode="indice">
        <xsl:for-each select="ARQELEM">
            <xsl:variable name="id" select="0 + position() * 1"/>
            <html>
                <head>
                    <style>
                        div {
                            background-color: #FFFFFF
                        }
                        div:hover {
                            color: #FFFFFF;
                            background-color: #FF8A00
                        }</style>
                </head>

                <body>
                    <li>
                        <a href="http://localhost:7777/arqs/{$id}" style="color:#000000;text-decoration:none">
                            <div
                                style="padding:1px;padding-left:20px;margin-bottom:5px;margin-right:130px">
                                <p>
                                    <b>
                                        <xsl:value-of select="IDENTI"/>
                                    </b>
                                </p>
                                <p>
                                    <small><xsl:value-of select="normalize-space(FREGUE)"/>,
                                            <xsl:value-of select="normalize-space(CONCEL)"/></small>
                                </p>
                            </div>
                        </a>
                    </li>
                </body>
            </html>
        </xsl:for-each>
    </xsl:template>

    <!-- Páginas geradas -->
    <xsl:template match="ARQSITS">
        <xsl:for-each select="ARQELEM">
            <xsl:variable name="id" select="0 + position() * 1"/>
            <xsl:result-document href="site/arq{$id}.html">
                <html>
                    <head>
                        <title>
                            <xsl:value-of select="IDENTI"/>
                        </title>
                        <head>
                            <style>
                                div {
                                    background-color: #FF8A00;
                                    border: solid 2px #FF8A00
                                }
                                div:hover {
                                    color: #FF8A00;
                                    background-color: #FFFFFF;
                                    border: solid 2px #FF8A00
                                }</style>
                        </head>
                    </head>

                    <body
                        style="margin:0px;padding:0px;font-family:Arial;font-size:12pt;background-color:#EEEEEE">
                        <header style="padding:10px;background-color:#100E17;text-align:center">
                            <h1 style="color:#FFFFFF">Arqueossítio do NW Português</h1>
                            <h2 style="color:#FF8A00">
                                <xsl:value-of select="IDENTI"/>
                            </h2>
                        </header>

                        <main
                            style="text-align:justify;padding:10px;padding-left:30px;padding-right:30px;margin-top:20px;margin-bottom:20px;margin-left:130px;margin-right:130px;background-color:#FFFFFF">
                            <p>
                                <b>Descrição: </b>
                                <xsl:value-of select="DESCRI"/>
                            </p>
                            <xsl:if test="CRONO">
                                <p>
                                    <b>Cronologia: </b>
                                    <xsl:value-of select="CRONO"/>
                                </p>
                            </xsl:if>
                            <p>
                                <b>Lugar: </b>
                                <xsl:value-of select="LUGAR"/>
                            </p>
                            <p>
                                <b>Freguesia: </b>
                                <xsl:value-of select="FREGUE"/>
                            </p>
                            <p>
                                <b>Concelho: </b>
                                <xsl:value-of select="CONCEL"/>
                            </p>
                            <xsl:if test="CODADM">
                                <p>
                                    <b>CODADM: </b>
                                    <xsl:value-of select="CODADM"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="LATITU">
                                <p>
                                    <b>Latitude: </b>
                                    <xsl:value-of select="LATITU"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="LONGIT">
                                <p>
                                    <b>Longitude: </b>
                                    <xsl:value-of select="LONGIT"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="ALTITU">
                                <p>
                                    <b>Altitude: </b>
                                    <xsl:value-of select="ALTITU"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="ACESSO">
                                <p>
                                    <b>Acesso: </b>
                                    <xsl:value-of select="ACESSO"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="QUADRO">
                                <p>
                                    <b>Quadro: </b>
                                    <xsl:value-of select="QUADRO"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="TRAARQ">
                                <p>
                                    <b>TRAARQ: </b>
                                    <xsl:value-of select="TRAARQ"/>
                                </p>
                            </xsl:if>
                            <p>
                                <b>DESARQ: </b>
                                <xsl:value-of select="DESARQ"/>
                            </p>
                            <xsl:if test="INTERP">
                                <p>
                                    <b>INTERP: </b>
                                    <xsl:value-of select="INTERP"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="DEPOSI">
                                <p>
                                    <b>DEPOSI: </b>
                                    <xsl:value-of select="DEPOSI"/>
                                </p>
                            </xsl:if>
                            <xsl:if test="INTERE">
                                <p>
                                    <b>INTERE: </b>
                                    <xsl:value-of select="INTERE"/>
                                </p>
                            </xsl:if>
                            <p>
                                <b>Bibliografia: </b>
                                <xsl:for-each select="BIBLIO">
                                    <li style="margin-left:50px">
                                        <xsl:value-of select="."/>
                                    </li>
                                </xsl:for-each>
                            </p>
                            <p>
                                <b>Autor: </b>
                                <xsl:value-of select="AUTOR"/>
                            </p>
                            <p>
                                <b>Data: </b>
                                <xsl:value-of select="DATA"/>
                            </p>
                        </main>

                        <center>
                            <a href="http://localhost:7777/arqs"
                                style="color:#FFFFFF;text-decoration:none">
                                <div style="text-align:center;padding:10px;display:inline-block">
                                    Voltar ao índice </div>
                            </a>
                        </center>

                        <footer
                            style="padding:10px;margin-top:20px;background-color:#100E17;text-align:center">
                            <span style="color:#FFFFFF">
                                <xsl:value-of
                                    select="format-dateTime(current-dateTime(), 'Página gerada em: [D01]/[M01]/[Y0001] [H01]:[m01]')"
                                />
                            </span>
                        </footer>
                    </body>
                </html>
            </xsl:result-document>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
