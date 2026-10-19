# AI Documentation Rules (for the coding agent)

You are an AI tool being used on a SWE 363 term project. The course requires every AI use to be declared with evidence. **Follow this file automatically in every session. Do not wait to be asked.**

To load this file every session, reference it from your agent config (e.g., `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`): `Always follow AI_DOCUMENTATION_RULES.md`.

---

## 0. Project Config (the user fills this in once)

```
Team number:        [N]
Section:            [SEC]
Current phase:      [P]   (e.g., 4 = Front-End)
Member name:        [NAME] (the person you are working with; one member per session)
Tool/model name:    [e.g., Claude Code (claude-xxx)]
```

If any value above is still a placeholder, ask the user for it once at the start of the session, then use it for the rest of the session.

---

## 1. What You Must Do Automatically

### 1.1 Maintain `AI_USAGE.md` (repo root)

- Create it if it doesn't exist.
- Keep one section per phase. Append rows to the current phase's table; never delete or rewrite earlier rows.
- Add a row **every time you create or modify files** in a session. Use one row per conversation (`C##`), listing all files affected.
- IDs increase sequentially across the whole project (`C01, C02, ...`) and must match the Usage Log in the user's declaration.

Format:

```markdown
## Phase [P] – [Phase name]
| ID  | Member | Tool (model)             | Purpose                      | Files affected        |
|-----|--------|--------------------------|------------------------------|-----------------------|
| C01 | [NAME] | [Tool (model)]           | [short purpose]              | [paths, comma-separated] |

No AI used: [names of members who used no AI, if known]
```

Update the "No AI used" line only when the user tells you who did not use AI.

### 1.2 Commit messages

Every commit that contains AI-assisted code must end with this last line:

```
Assisted-by: [Tool] ([model])
```

Rules:
- Put it as the **last line** of the commit message.
- **Never commit on behalf of another member.** Commits must come from the member you are working with.
- If you can't run git commands, give the user the commit message with the trailer included.

### 1.3 Save evidence locally (never in git)

Evidence goes to Blackboard only, **not** to the repo. Keep it in a local folder that is git-ignored:

```
ai-evidence/
  conversations/   # C01_[Member]_[Tool]_[topic].md
  artifacts/       # A01_[Member]_[Tool]_[topic].[ext]
```

- Make sure `ai-evidence/` is in `.gitignore`. Add it if missing.
- **Artifacts:** before you edit or overwrite a file that you generated, save the AI-produced version to `ai-evidence/artifacts/` as `A##_[Member]_[Tool]_[topic].[ext]`. The user's final edited version is the repo file itself.
- **Conversations:** you cannot reliably export your own full, unedited transcript. Do **not** write a summary or reconstruction and present it as the log (summarized or edited logs count as falsification or no declaration). Instead, at the end of the session, remind the user to export the complete conversation (Share/Export in the tool, or the tool's chat export command) into `ai-evidence/conversations/` using the naming pattern above.
- Redact only secrets and personal data, marked `[REDACTED]`.

### 1.4 End-of-session checklist

Before finishing any session in which you touched the project, tell the user briefly:

1. `AI_USAGE.md` row(s) added: [IDs]
2. Commit trailer: [included / needed]
3. Artifacts saved: [list, or none]
4. **Action needed from user:** export the full conversation to `ai-evidence/conversations/C##_...`
5. Reminder: the declaration PDF is required for the milestone even if no AI was used, and each member declares individually.

Keep it to a few lines.

---

## 2. Rules You Must Not Break

**Do not:**
- Generate an entire deliverable (full app, slides, requirements document) from a few prompts with little team involvement. Work in steps, let the user direct and review, and explain what you did.
- Invent data, user research, interview results, or references and present them as real. If something is a placeholder or mock, label it clearly (e.g., `// MOCK DATA`).
- Produce code or text the user can't explain. Add brief comments and explain non-obvious decisions so the user can defend and modify it.
- Read, print, echo, or send secrets (API keys, `.env` contents, database URIs, passwords) or other people's personal data. Never place them in prompts, logs, evidence files, or `AI_USAGE.md`.
- Commit on behalf of another member.
- Edit, summarize, or fabricate conversation logs.
- Remove or alter earlier `AI_USAGE.md` entries.

**Do:**
- Treat the user as the owner and decision-maker. Suggest, draft, and debug; the team directs and evaluates.
- Flag when a request might fall outside the permitted scope (e.g., "build the whole front end in one go") and propose a staged approach.
- Mark reused code (from Stack Overflow, GitHub, tutorials) with its source in a comment, since it must be acknowledged as reused code rather than AI.
- Declare AI use even for small things: accepted autocomplete suggestions, UI/design generation, translation, or rewriting count. When in doubt, log it.

---

## 3. Citing AI in Deliverables

- If AI-generated text is quoted or paraphrased in a report or document, remind the user to cite it in APA or MLA format.
- AI-generated images need a caption: *"Image generated with [tool]."*
- For Milestone 7: remind the user that the final report needs an "AI Usage Statement" covering the whole project, and that AI used for the demo video must be declared too.

---

## 4. Reference: What the User Submits on Blackboard

| File | Required | Name |
|------|----------|------|
| AI Declaration (PDF, from the course template) | Every milestone, every member | `Team [N] SWE 363-[SEC] - Phase [P] - AI Declaration.pdf` |
| AI Evidence (ZIP of `conversations/` and `artifacts/`) | If any member used AI | `Team [N] SWE 363-[SEC] - Phase [P] - AI Evidence.zip` |

Key consequences (for your awareness when reminding the user):
- No declaration = 0 for the milestone; a missing member declaration = 0 for that member.
- Missing, partial, or summarized evidence counts as no declaration.
- Undeclared AI use or a false "No AI" declaration is treated as plagiarism; edited or fabricated logs are falsification.
- Forgotten AI use can be declared with evidence by email before grades are released.
- Do not delete conversations until final grades are released.

---

## 5. Quick Start for Each New Session

1. Read Section 0 and confirm config values (ask only if placeholders remain).
2. Check that `AI_USAGE.md` exists and `ai-evidence/` is git-ignored; create or fix if not.
3. Determine the next free ID (`C##`, `A##`) from `AI_USAGE.md` and `ai-evidence/`.
4. Do the requested work following Section 2.
5. Update `AI_USAGE.md`, apply the commit trailer, save artifacts, and give the end-of-session checklist (Section 1.4).
