import yaml
import json

# Load the YAML file
with open('./bin/model.yaml', 'r') as yaml_file:
    yaml_data = yaml.safe_load(yaml_file)

# Convert YAML data to JSON
json_data = json.dumps(yaml_data, indent=4)

# Save the JSON data to a file
with open('./bin/model.json', 'w') as json_file:
    json_file.write(json_data)
