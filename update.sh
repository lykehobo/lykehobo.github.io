#!/bin/bash

# Directory to read files from (change this to your target directory)
TARGET_DIR="Work"

# HTML file to update
HTML_FILE="index.html"

# Temporary file to hold the new HTML structure
TEMP_FILE="temp.html"

# Function to generate HTML from the directory structure
generate_html() {
    local indent="$1"
    local dir="$2"
    local html=""
    local entries=()
    
    # Loop through the directory contents and store entries in an array
    while IFS= read -r -d '' entry; do
        entries+=("$entry")
    done < <(find "$dir" -mindepth 1 -maxdepth 1 -print0)

    local count=${#entries[@]}
    
    # Loop through the entries in reverse order to generate HTML
    for ((i=count-1; i>=0; i--)); do
        local entry="${entries[$i]}"
        local file_name=$(basename "$entry")
        
        if [[ -d "$entry" ]]; then
            html+="${indent}<span class=\"folder\" data-toggle=\"$file_name\">$file_name</span>"
            html+="${indent}<div class=\"folder-content hidden\">"
            html+="$(generate_html "${indent}    " "$entry")"
            html+="</div>"
        elif [[ -f "$entry" ]]; then
            # Use correct prefix based on if it's the last entry
            if [ "$i" -eq 0 ]; then
                html+="${indent}<span class=\"file\" data-filename=\"$entry\">└── $file_name</span>"
            else
                html+="${indent}<span class=\"file\" data-filename=\"$entry\">├── $file_name</span>"
            fi
        fi
    done
    # Return the generated HTML
    echo -n "$html"
}

# Start the HTML generation process
generate_html "    " "$TARGET_DIR" > "$TEMP_FILE"

# Extract the position to insert the new file tree
START_TAG="<div id=\"file-tree\">"
END_TAG="</div>"

# Replace the content of the file-tree while keeping the input field above it
sed -i "/$START_TAG/,/$END_TAG/{/$START_TAG/!{/$END_TAG/!d;};}" "$HTML_FILE"
sed -i "/$START_TAG/r $TEMP_FILE" "$HTML_FILE"

# Clean up
rm "$TEMP_FILE"

echo "HTML file has been updated."