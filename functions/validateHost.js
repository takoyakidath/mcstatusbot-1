'use strict';
import unidecode from 'unidecode';
import validator from 'validator';
import bogon from 'bogon';
const { isIP, isFQDN, isEmpty, isPort } = validator;

export function validateHost(host) {
	let [ip, port] = host.split(':');

	if (host.includes(':')) {
		return validateAddress(ip) && !isEmpty(port) && isPort(port);
	}

	return validateAddress(ip);
}

function validateAddress(ip) {
	const decoded = unidecode(ip);

    if (isIP(decoded)) {
        return isIP(decoded) && !bogon(ip);
    }

    return isFQDN(decoded, {
        allow_underscores: false,
        allow_numeric_tld: true
    });
}
