lsof -i:8002 | awk '{print $2}' | tail -1
