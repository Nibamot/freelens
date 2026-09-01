#!/bin/bash

if [[ $1 == "remove" ]]; then
	if type update-alternatives >/dev/null 2>&1; then
		update-alternatives --remove ims-scope /usr/bin/ims-scope
	else
		rm -f /usr/bin/ims-scope
	fi
fi
