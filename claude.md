# Claude Code Instructions

## Git Workflow Rules

### Local Commits
- ✅ Always commit changes locally first using `git commit`
- ✅ Verify the local commit was successful with `git log`
- ✅ No need to ask permission for local commits

### Pushing to GitHub
- ❌ **ALWAYS ask the user for permission before running `git push`**
- ❌ Do NOT push to the remote GitHub repository without explicit approval
- ⚠️ Wait for the user to confirm before pushing

### Example Workflow
1. Make code changes
2. Commit locally with `git commit -m "..."`
3. Verify with `git log --oneline -3`
4. **ASK THE USER**: "Ready to push to GitHub?" or "Should I push these changes?"
5. Only push after user approval

## This ensures the user always has control over what gets pushed to the remote repository.
