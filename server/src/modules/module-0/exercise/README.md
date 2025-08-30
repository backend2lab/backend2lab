# Module 0 Exercise: Simple Greeting Function

## Objective
Create a simple Node.js program that demonstrates basic function creation and module usage with a greeting function.

## What You'll Build
A greeting program that:
- Takes a name as a parameter
- Returns a personalized greeting message
- Uses Node.js modules

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir greeting-app
   cd greeting-app
   ```

2. **Create these files**:
   ```
   greeting-app/
   ├── greetings.js
   └── index.js
   ```

## Step-by-Step Implementation

### Step 1: Create the Greetings Module

Create `greetings.js`:

```javascript
// TODO: Write your greeting function here
// The function should:
// - Take a 'name' parameter
// - Return a greeting message like "Hello, [name]! Welcome to Node.js!"

function greetUser(name) {
    // Your code here
}

// Export the function so it can be used in other files
module.exports = {
    greetUser
};
```

### Step 2: Create the Main File

Create `index.js`:

```javascript
// Import the greetings module
const greetings = require('./greetings');

// Test your function with different names
console.log(greetings.greetUser('Alice'));
console.log(greetings.greetUser('Bob'));
console.log(greetings.greetUser('Charlie'));
```

## Your Task

Complete the `greetUser` function in `greetings.js`:

1. The function should accept one parameter called `name`
2. Return a greeting message that includes the name
3. The message should be: `"Hello, [name]! Welcome to Node.js!"`

## Testing Your Solution

Run your program with:
```bash
node index.js
```

## Expected Output

```
Hello, Alice! Welcome to Node.js!
Hello, Bob! Welcome to Node.js!
Hello, Charlie! Welcome to Node.js!
```

## Solution

<details>
<summary>Click to see the solution (try it yourself first!)</summary>

```javascript
function greetUser(name) {
    return `Hello, ${name}! Welcome to Node.js!`;
}

module.exports = {
    greetUser
};
```

</details>

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add time-based greetings**: "Good morning, Alice!" or "Good evening, Bob!"
2. **Multiple greeting styles**: Add a second parameter for greeting type
3. **Validation**: Handle empty names or invalid inputs
4. **Personal touches**: Add random compliments to the greeting

## What You Learned

- ✅ Creating functions in Node.js
- ✅ Using function parameters
- ✅ Exporting and importing modules
- ✅ Running Node.js programs
- ✅ Template literals for string formatting
