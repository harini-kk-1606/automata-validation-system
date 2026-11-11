# Automata Lab — Real-Time Validation System

**Course:** 21CSC301T — Formal Language and Automata  
**Assessment:** CLA-2, Task 2 — Designing Automata for Real-Time Applications  
**Programme context:** B.Tech. Artificial Intelligence and Machine Learning

An interactive, browser-based demonstration of finite automata used to validate three common input formats: passwords, email addresses and ATM PINs.

## Features

- Three interactive validators with character-by-character transition traces.
- Formal alphabet, language and acceptance-condition descriptions.
- DFA state summaries.
- Ten built-in examples per validator (five accepted and five rejected).
- Clear explanation of assumptions and limitations.
- Responsive interface; no server, build process or package installation required.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select Password, Email or ATM PIN.
4. Enter a test string and select **Run automaton**.
5. Inspect the result and transition trace. Use the built-in test suite to load examples.

```bash
git clone https://github.com/YOUR-USERNAME/automata-lab.git
cd automata-lab
```

Then open `index.html`. Alternatively, use the VS Code Live Server extension.

## Application 1 — Password verification

### Rule and assumptions

A password is accepted if:
- It contains between 8 and 16 characters, inclusive.
- It contains at least one uppercase English letter.
- It contains at least one lowercase English letter.
- It contains at least one decimal digit.
- It contains at least one character from the defined special-character set: `!@#$%^&*()_+-=[]{};':"\\|,.<>/?`~`.
- Every character belongs to one of those four classes.

This is a deliberately specified educational password policy, not a universal password standard.

### Formal model

The input alphabet is partitioned into four classes: `U` (uppercase), `L` (lowercase), `D` (digit), and `S` (special). Other symbols are outside the defined alphabet and are rejected.

A DFA can be represented as:

`M = (Q, Σ, δ, q0, F)`

The state records the four observed-character flags and the input length, capped at 17 (17 represents overflow). Therefore the state space is finite. The accepting states are all states with length 8–16 and all four flags set.

Language:

`L = { w ∈ Σ* | 8 ≤ |w| ≤ 16, U(w) ≥ 1, L(w) ≥ 1, D(w) ≥ 1, S(w) ≥ 1 }`

The implementation tracks the flags while reading the input and checks the length and alphabet at the end. This is an equivalent finite-state construction; the UI shows the evolving flag-state.

## Application 2 — Email format validation

### Rule and assumptions

The project uses a simplified email syntax for teaching purposes:
- Exactly one `@` is required.
- The local part must be non-empty and may contain ASCII letters, digits, `.`, `_`, `%`, `+`, and `-`.
- The local part cannot start or end with a dot, or contain consecutive dots.
- The domain must contain at least two labels separated by dots.
- Domain labels contain ASCII letters, digits or hyphens; they cannot be empty or start/end with a hyphen.
- The final suffix must contain at least two English letters.
- Whitespace is not permitted.

This is not a complete implementation of every valid address in the email standards.

### Formal model

`Σ` is the permitted ASCII character set. The DFA moves through phases representing the local part, `@`, domain labels, dot separators and final suffix. Invalid characters or illegal ordering lead to rejection.

The validator checks syntax only. It does not check DNS records, mailbox existence, ownership or deliverability.

## Application 3 — ATM PIN verification

### Rule and assumptions

The PIN alphabet is `Σ = {0,1,2,3,4,5,6,7,8,9}`. A string is accepted when its length is exactly 4 or exactly 6.

Language:

`L = { w ∈ {0,1,...,9}* | |w| = 4 or |w| = 6 }`

### DFA state description

- `q0`: no digits read.
- `q1`, `q2`, `q3`: one, two or three digits read.
- `q4`: accepting state for a four-digit PIN.
- `q5`: five digits read; non-accepting.
- `q6`: accepting state for a six-digit PIN.
- `qDead`: a non-digit or a seventh digit was read.

On a digit, the automaton advances to the next count state. From `q6`, any further input goes to `qDead`. Any non-digit goes to `qDead` from every state.

The model checks format only. Real ATM authentication also requires secure PIN comparison, account/session context, attempt limits, secure input handling and bank-side authorization.

## Why a finite automaton is useful — and its limits

A DFA is suitable when the validation rule can be decided using a finite amount of state, such as tracking character classes, parsing a restricted format or counting up to a fixed maximum. The machine has a finite number of states and processes each input symbol deterministically.

These examples deliberately distinguish **syntax/format validation** from **semantic or business validation**. A syntactically valid email may not exist; a password that meets the format policy may still be weak or compromised; and a correctly shaped PIN may not be authorized for an account.

## Test cases

The web interface includes ten cases per application: five expected accepted and five expected rejected examples. Select a row to load the value into the corresponding validator and run it to inspect the trace.

## Project structure

```text
automata-lab/
├── index.html       # Application layout and sections
├── style.css        # Responsive styling
├── script.js        # DFA-inspired validation logic and test data
├── README.md        # Project and formal-model documentation
├── REPORT.md        # Assignment-ready design note
├── .gitignore
└── LICENSE
```

## GitHub publishing

1. Create a new public repository on GitHub (for example, `automata-lab`).
2. Extract this project folder.
3. In a terminal opened in the folder, run:

```bash
git init
git add .
git commit -m "Build automata validation project for CLA-2 Task 2"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/automata-lab.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Academic note

This project is a working demonstration and a starting point for your individual submission. Review the rules, test the examples, and be prepared to explain the alphabet, states, transitions, accepting conditions and limitations in your viva. Add your own name, register number, screenshots and any faculty-specific formatting before submission.

## SDG alignment

The assignment identifies **SDG 9 — Industry, Innovation and Infrastructure**, at Level 2 (Design Alignment). This project demonstrates a small formal-methods design exercise relevant to software input validation.
