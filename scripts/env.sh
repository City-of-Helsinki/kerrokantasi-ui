#!/bin/bash

ENVDIR=${1:-.}
TARGETDIR=${2:-.}
# Recreate config file
rm -f $TARGETDIR/env-config.js
touch $TARGETDIR/env-config.js

REACT_APP_VERSION=$(grep -m1 version $ENVDIR/package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
REACT_APP_APPLICATION_NAME=$(grep -m1 name $ENVDIR/package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')

# Add assignment
echo "window._env_ = {" >> $TARGETDIR/env-config.js

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  #Remove quotes around the value to make it easier to use value
  value=${value%\"}
  value=${value#\"}
  # Append configuration property to JS file
  echo "  $varname: \"$(echo ${value} | envsubst)\"," >> $TARGETDIR/env-config.js

  # Store value to current subshell to allow usage of it at later values
  export $varname="$(echo ${value} | envsubst)"
done < $ENVDIR/.env

echo "}" >> $TARGETDIR/env-config.js
