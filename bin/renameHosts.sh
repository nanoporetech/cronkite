#! /bin/bash

sed -i'_orig' -E 's/localhost:[0-9]+/metrichor-reports.git.oxfordnanolabs.local/g' ./www/cronkite/examples/reports/*
