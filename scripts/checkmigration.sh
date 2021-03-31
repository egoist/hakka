#!/bin/bash
set -e

# check migration
check_results=`yarn migrate:check`
echo "check typeorm migration results are: $check_results"
if ! [[ $check_results =~ "Your schema is up to date" ]]
then
     echo 'Your schema not up to date'
     exit 1
fi
