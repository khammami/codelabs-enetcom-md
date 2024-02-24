#!/bin/bash

set -euo pipefail  # Enable strict error handling

# Iterate through each subfolder within the codelabs folder
for folder in codelabs/*/; do
  # Check if a codelab.json file exists within the folder
  if [[ -f "$folder/codelab.json" ]]; then
    # Extract the source and id fields from the JSON file
    source=$(jq -r '.source' "$folder/codelab.json")
    id=$(jq -r '.id' "$folder/codelab.json")

    filename="codelabs.json"
    entry="{\"id\": \"$id\", \"source\": \"$source\"}"

    # Create the file with an empty array if it doesn't exist
    [ -f "$filename" ] || echo '[]' > "$filename"

    # Check for existing entry based on "source" key using jq
    if ! jq -r 'any(.source == $source)' "$filename"; then
      jq -r ". += [$entry]" "$filename" > "$filename.tmp"
      mv "$filename.tmp" "$filename"
      echo "Successfully added entry with id: $id and source: $source"
    fi
  fi
done