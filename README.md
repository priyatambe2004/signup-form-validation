# Sprout – Signup Form with Validation

**Task 26 · Web Development Track ·**

A signup page with name, email and password fields that validates input, shows inline error messages, rates password strength and blocks submission until everything is valid. It sits inside a small landing-page website.

## Objective

Practice form validation, regular expressions, and user feedback.

## Tools

- HTML5
- CSS3
- JavaScript (vanilla, no libraries)

## Project structure

```
signup-form/
├── index.html   # Page and form markup
├── style.css    # Design, error and success states, themes
├── script.js    # Validators, regex, strength meter, submit logic
└── README.md
```

## How to run

Keep the three files together and open `index.html` in a browser. No server is needed. Fonts load from Google Fonts and fall back to system fonts offline.

This is a practice project: the form is validated in the browser and nothing is sent or stored. A real signup must also be validated on the server.

## Deliverables

| Deliverable | How it is done |
| --- | --- |
| Name, email, and password fields | Plus a confirm-password field and a terms checkbox |
| Inline validation messages | An error paragraph under each field, linked with `aria-describedby` |
| Password strength indicator | Five-segment meter, a label (Very weak to Strong) and a live checklist of rules |
| Prevent submission until valid | `submit` is cancelled with `preventDefault()` unless every validator passes |

## Hints from the task

- **Email regex:** `/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/`
- **Password length and complexity:** at least 8 characters with a lowercase letter, an uppercase letter and a number. A symbol and 12+ characters raise the strength score.
- **Errors next to the field:** each message appears directly under its input and the field gets a red or green border.

## Extra features

- Validation runs when you leave a field, then updates live as you type, so errors never appear before you have had a chance to type.
- Confirm password re-checks automatically when the password changes.
- Show and hide buttons for both password fields.
- Rejects common passwords and passwords that contain the email name.
- Friendly hint for common email typos such as `gmial.com`.
- Progress bar ("3 of 5 steps complete").
- Error summary and focus moves to the first invalid field on a failed submit.
- Loading state and a welcome screen (simulated, with no data sent).
- Dark and light themes, responsive layout, and accessible labels, `aria-invalid` and `role="alert"`.

## Interview questions

**How would you validate an email with a regular expression?**
Test the string against a pattern such as `/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/` with `.test()`. It checks for allowed characters, one `@`, a domain and a top-level domain of at least two letters. A regex only checks the format, not whether the mailbox exists, so real apps send a confirmation email.

**Why show inline errors instead of an alert?**
Inline messages sit next to the field that needs fixing, so the user keeps their place and can fix several fields at once. An `alert()` blocks the page, disappears once dismissed and is easy to forget. Inline errors can also be tied to the input with `aria-describedby` so screen readers announce them.

**How would you check password strength?**
Score the password on length and variety: 8 or more characters, both lowercase and uppercase, a number, a symbol and 12 or more characters each add a point. Cap the score for very short or common passwords. Show the result with a meter and a checklist so users know what to improve.

## 👩‍💻 Author

Priya Tambe
