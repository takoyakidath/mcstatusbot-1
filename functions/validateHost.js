'use strict';
import unidecode from 'unidecode';
import validator from 'validator';
import bogon from 'bogon';
const { isIP, isFQDN, isEmpty, isPort } = validator;

export function validateHost(host) {
	let [ip, port] = host.split(':');

	if (host.includes(':')) {
		// First validate the IP address
		const ipCheck = validateAddress(ip);

		if (ipCheck.valid) {
			// Then validate the port
			if (!isEmpty(port) && isPort(port)) {
				return { valid: true };
			}

			return { valid: false, reason: 'port' };
		}

		// If the IP address is invalid, return the error that the IP address validator returned
		return ipCheck;
	}

	return validateAddress(ip);
}

function validateAddress(ip) {
	const decoded = unidecode(ip);

	if (isIP(decoded)) {
		if (bogon(decoded)) {
			return { valid: false, reason: 'bogon' };
		}
		return { valid: true };
	}

	if (!isFQDN(decoded)) {
		return { valid: false, reason: decoded.includes('_') ? 'underscore' : 'invalid' };
	}

	return { valid: true };
}
