lsof -i:3002 | awk '{print $2}' | grep -v '^PID'
