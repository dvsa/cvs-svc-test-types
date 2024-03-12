lsof -i:3010 | awk '{print $2}' | grep -v '^PID'
