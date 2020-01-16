#! /bin/bash

for filename in ./www/cronkite/examples/reports/*.json; do
  echo $filename
  sed -i '' -E 's/localhost:[0-9]+/metrichor-reports.git.oxfordnanolabs.local/g' $filename
done
