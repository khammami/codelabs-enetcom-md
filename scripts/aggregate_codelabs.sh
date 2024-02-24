#!/bin/bash

# Declare an empty array to store unique entries
unique_entries=()

# Iterate through each subfolder within the codelabs folder
for folder in codelabs/*/; do
  # Check if a codelab.json file exists within the folder
  if [[ -f "$folder/codelab.json" ]]; then
    # Extract the source and id fields from the JSON file
    source=$(jq -r '.source' "$folder/codelab.json")
    id=$(jq -r '.id' "$folder/codelab.json")

    # Skip entry if it already exists in the new codelabs.json
    entry="{\"source\": \"$source\", \"id\": \"$id\"}"
    if ! grep -q "$source" "codelabs.json"; then
      # Add the extracted fields as a new entry to the array
      unique_entries+=("$entry")
    fi
  fi
done

# Create the codelabs.json file with the unique entries
cat > codelabs.json <<EOF
[
    ${unique_entries[*]}
]
EOF
