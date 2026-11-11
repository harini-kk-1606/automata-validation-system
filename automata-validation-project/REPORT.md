# Design Note — Automata-Based Real-Time Validation System

**Course:** 21CSC301T — Formal Language and Automata  
**Assessment Task 2:** Designing Automata for Real-Time Applications  
**Student name:** [Enter your name]  
**Register number:** [Enter your register number]  
**Department:** AIML  
**Academic year:** 2026–2027

## 1. Aim

To design and demonstrate finite automata for three input-validation applications: password verification, email-format validation and ATM PIN verification. The system defines the input alphabet and accepted language, describes the automaton's states and transitions, and validates accepted and rejected strings.

## 2. Password verification

**Language rule:** Accept passwords of length 8–16 that contain at least one uppercase letter, lowercase letter, digit and permitted special character.

**Alphabet:** Four character classes, `Σ = U ∪ L ∪ D ∪ S`, where U, L, D and S denote uppercase, lowercase, decimal digit and permitted special character.

**State construction:** The DFA records a four-bit flag vector indicating which character classes have appeared and a bounded length counter. The counter has values 0 through 17, with 17 representing any length greater than 16. The initial state has no flags set and length zero. On reading a character, the relevant flag is set and the length increases. An input outside the defined alphabet is rejected.

**Accepting condition:** Length is 8–16 and all four flags are set.

**Examples:** Accepted — `Abcdef1!`, `Hello123@`, `A1!bcdefg`, `Strong#9a`, `XyZ!4567a`. Rejected — `abcdef1!` (no uppercase), `ABCDEF1!` (no lowercase), `Abcdefgh!` (no digit), `Abcdefg1` (no special character), `Aa1!` (too short).

## 3. Email-format validation

**Language rule:** Accept a simplified email-shaped string with exactly one `@`, a non-empty local part, a valid multi-label domain and a final suffix of at least two letters.

**Alphabet:** ASCII letters, digits, `.`, `_`, `%`, `+`, `-` and `@`, subject to their positions in the format.

**State construction:** The DFA has phases for the local part, separator, domain labels, dot separator and suffix. It rejects illegal symbols, whitespace, repeated separators and incomplete components.

**Accepting condition:** Exactly one `@`; valid non-empty local part; at least two non-empty domain labels; no domain label starts or ends with a hyphen; final suffix has at least two letters.

**Examples:** Accepted — `student@example.com`, `a.b+tag@sub.example.in`, `user_1@my-domain.org`, `name99@college.edu`, `first-last@site.co`. Rejected — `@example.com` (empty local part), `user@` (missing domain), `userexample.com` (missing @), `user@@example.com` (multiple @), `user name@example.com` (space).

**Limitation:** This is a simplified syntax subset, not a full standards-compliant email parser. It does not verify that the mailbox exists or can receive mail.

## 4. ATM PIN verification

**Language rule:** Accept strings containing exactly four or six decimal digits.

**Alphabet:** `Σ = {0,1,2,3,4,5,6,7,8,9}`.

**States:** `q0` through `q6` count the digits read. `q4` and `q6` are accepting states. `qDead` is the dead state for non-digits or excess input.

**Transitions:** On a digit, move from `qi` to `q(i+1)` while the count is below six. Any non-digit moves to `qDead`. Any additional character after six digits moves to `qDead`.

**Examples:** Accepted — `1234`, `0000`, `739152`, `111111`, `9087`. Rejected — `123` (three digits), `12345` (five digits), `1234567` (seven digits), `12a4` (non-digit), `12 34` (space).

**Limitation:** The automaton verifies only PIN format. It does not authenticate the user or verify a PIN against bank records.

## 5. Comparison and model limitations

| Application | Finite-state information | What is validated | What is outside the model |
|---|---|---|---|
| Password | Four category flags and bounded length | Defined password policy | Strength, breach status, identity |
| Email | Parser phase and local/domain constraints | Simplified syntax | Mailbox existence, ownership, deliverability |
| ATM PIN | Digit count and dead state | Four- or six-digit format | Account match, authorization, attempt limits |

A finite automaton is sufficient for these bounded rules because the required information can be represented by finitely many states. More complex semantic checks require external services, databases or additional processing.

## 6. Demonstration procedure

1. Open `index.html` in a browser.
2. Select each validator.
3. Enter one accepted and one rejected example.
4. Run the automaton and observe the result and transition trace.
5. Open the test suite and load the remaining examples.
6. Explain the alphabet, state representation, acceptance condition and limitations for each model.

## 7. Conclusion

The project demonstrates how finite automata can model practical input-format validation. The three examples show deterministic processing of strings and the use of accepting and rejecting states. They also show why format validation must not be confused with authentication or other semantic checks.

## 8. References

- CLA-2 Assignment Instructions, 21CSC301T — Formal Language and Automata, Assessment Task 2, SRM Institute of Science and Technology, Tiruchirappalli, AY 2026–2027.
- Course learning materials on finite automata, regular languages, alphabets, transition functions and accepting states.

## 9. Individual contribution

[Add your actual contribution here. If this is an individual submission, state that you completed the modelling, implementation, testing and documentation yourself.]
