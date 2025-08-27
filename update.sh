#!/bin/bash
# Auto-commit & push site changes with timestamped message

# Stage everything
git add .

# Commit with date/time in message
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to main branch
git push origin main
