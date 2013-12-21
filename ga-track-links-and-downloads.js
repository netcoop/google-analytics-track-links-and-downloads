/**
 * Enable tracking of downloads, external links and mailto- and tel-links with Google Analytics
 * https://github.com/netcoop/google-analytics-track-links-and-downloads
 * v0.1 Date: 21/12/13
 */

var testMode = true;	// true will not trigger GA but launch an alert-box, and links will not work, for easy testing

// Google Analytics tracking code
if (!testMode) {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-xxxxxxx-xx', 'domain.com');
	ga('send', 'pageview');
}

if (typeof jQuery != 'undefined') {
	jQuery(document).ready(function($) {
		var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
		var baseHref = '';
		if (jQuery('base').attr('href') != undefined) baseHref = jQuery('base').attr('href');

		jQuery('a').on('click', function(event) {
			if (testMode) event.preventDefault();
			var el = jQuery(this);
			var track = true;
			var href = (typeof(el.attr('href')) != 'undefined' ) ? el.attr('href') :"";
			// If other domains should be treated as local, list all local domains under aliasDomains
			var aliasDomains = ['www.domain.com', 'domain.com'];
			var hrefDomain = href.match(/^https?\:\/\/([A-Za-z0-9-_\.]*)\//i);
			if (hrefDomain !== null) {
				var isThisDomain = (jQuery.inArray(document.domain, aliasDomains)!==-1 && jQuery.inArray(hrefDomain[1], aliasDomains)!==-1)
					|| typeof(href.match(document.domain)) == 'string';
			} else {
				var isThisDomain = -1;
			}
			if (/^javascript:linkTo_UnCryptMailto/.test(href)) {
				var decrypt = href.match(/^javascript:linkTo_UnCryptMailto\(\'(.*)\'\)\;/i);
				href = decryptString(decrypt[1], 3);	// 3 should match the TypoScript setting spamProtectEmailAddresses
			}
			if (!/^javascript:/i.test(href)) {
				var elEv = [];
				if (/^mailto\:/i.test(href)) {
					elEv.category = "Email";
					elEv.action = "Click";
					elEv.label = href.replace(/^mailto\:/i, '');
					elEv.loc = href;
				}
				else if (filetypes.test(href)) {
					var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
					elEv.category = "Download";
					elEv.action = "Click-" + extension[0];
					elEv.label = href.replace(/ /g,"-");
					elEv.loc = baseHref + href;
				}
				else if (/^https?\:\/\//i.test(href) && !isThisDomain) {
					elEv.category = "Externe Link";
					elEv.action = "Click";
					elEv.label = href.replace(/^https?\:\/\//i, '');
					elEv.non_i = true;
					elEv.loc = href;
				}
				else if (/^tel\:/i.test(href)) {
					elEv.category = "Telephone";
					elEv.action = "Click";
					elEv.label = href.replace(/^tel\:/i, '');
					elEv.loc = href;
				}
				else track = false;

				if (track) {
					if (testMode) {
						alert('Category: ' + elEv.category + "\nAction: " + elEv.action + "\nLabel: " + elEv.label.toLowerCase())
					} else {
						ga('send', 'event', elEv.category, elEv.action, elEv.label.toLowerCase());
						if ( el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank') {
							setTimeout(function() { location.href = elEv.loc; }, 400);
							return false;
						}
					}
				}
			}
		});
	});
}
