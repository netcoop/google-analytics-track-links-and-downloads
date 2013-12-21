google-analytics-track-links-and-downloads
==========================================

v0.1 Date: 21 Dec 13

Make Google Analytics track external links, downloads, mailto and telephone links

Works with TYPO3-encrypted mailto-links using TypoScript setting 'spamProtectEmailAddresses'

Before going online, check and change the following settings:
* Set testMode = false (ln 7)
* Fill in your Google Analytics code and domain (ln 15)
* Set the domains that should be treated as local in aliasDomains, if necessary (ln 31)

Script is based on a script found here:
http://www.blastam.com/blog/index.php/2013/03/how-to-track-downloads-in-google-analytics-v2/

