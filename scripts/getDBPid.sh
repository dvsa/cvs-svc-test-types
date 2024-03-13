!/bin/sh

# Config of port is done at the moment in serverless.yml and script handled for us
lsof -i:8002 | awk '{print $2}' | grep -v '^PID'
