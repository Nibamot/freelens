#!/bin/bash

if [[ $1 == "configure" ]]; then
	if type update-alternatives 2>/dev/null >&1; then
		if [[ -L /usr/bin/ims-scope && -e /usr/bin/ims-scope && "$(readlink /usr/bin/ims-scope || true)" != "/etc/alternatives/ims-scope" ]]; then
			rm -f /usr/bin/ims-scope
		fi
		update-alternatives --install /usr/bin/ims-scope ims-scope /opt/IMS-Scope/ims-scope 100 || ln -sf /opt/IMS-Scope/ims-scope /usr/bin/ims-scope
	else
		ln -sf /opt/IMS-Scope/ims-scope /usr/bin/ims-scope
	fi

	if ! { [[ -L /proc/self/ns/user ]] && unshare --user true; }; then
		chmod 4755 /opt/IMS-Scope/chrome-sandbox || true
	else
		chmod 0755 /opt/IMS-Scope/chrome-sandbox || true
	fi

	if hash apparmor_parser 2>/dev/null; then
		if apparmor_parser --skip-kernel-load --debug /etc/apparmor.d/ims-scope >/dev/null 2>&1; then
			if hash aa-enabled 2>/dev/null && aa-enabled --quiet 2>/dev/null; then
				apparmor_parser --replace --write-cache --skip-read-cache /etc/apparmor.d/ims-scope
			fi
		else
			if grep -qs "^[a-z]" /etc/apparmor.d/ims-scope; then
				sed -i "s/^/# /" /etc/apparmor.d/ims-scope
			fi
		fi
	fi
fi

# Older APT doesn't work with Github releases.

dollar='$'
if dpkg --compare-versions "$(dpkg-query -f "$dollar{Version}" -W apt || true)" lt "2.4.0"; then
	for f in /etc/apt/sources.list.d/ims-scope.sources /etc/apt/sources.list.d/ims-scope-nightly-builds.sources; do
		if [[ -f $f ]]; then
			if grep -qs "^[A-Z]" "$f"; then
				sed -i "s/^/# /" "$f"
			fi
		fi
	done
fi
