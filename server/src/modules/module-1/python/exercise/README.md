# Module 1 Exercise: Simple Greeting Function (Python)

## Objective
Create a simple Python program that demonstrates basic function creation and module usage with a greeting function.

## What You'll Build
A greeting program that:
- Takes a name as a parameter
- Returns a personalized greeting message
- Uses Python modules and functions

## Setup Instructions

1. **Create project folder**:
   ```bash
   mkdir greeting-app
   cd greeting-app
   ```

2. **Create these files**:
   ```
   greeting-app/
   ├── main.py
   └── requirements.txt
   ```

## Step-by-Step Implementation

### Step 1: Create the Greetings Module

Create `main.py`:

```python
# TODO: Write your greeting function here
# The function should:
# - Take a 'name' parameter
# - Return a greeting message like "Hello, [name]! Welcome to Python!"

def greet_user(name):
    # Your code here
    pass

# Export the function so it can be used in other files
if __name__ == "__main__":
    # Test the function
    print(greet_user("Alice"))
    print(greet_user("Bob"))
    print(greet_user("Charlie"))
```

### Step 2: Create Requirements File

Create `requirements.txt`:

```txt
pytest==7.4.3
pytest-json-report==1.5.0
```

## Your Task

Complete the `greet_user` function in `main.py`:

1. The function should accept one parameter called `name`
2. Return a greeting message that includes the name
3. The message should be: `"Hello, [name]! Welcome to Python!"`

## Testing Your Solution

Run your program with:
```bash
python main.py
```

## Expected Output

```
Hello, Alice! Welcome to Python!
Hello, Bob! Welcome to Python!
Hello, Charlie! Welcome to Python!
```

## Running Tests

To run the tests:
```bash
pip install -r requirements.txt
pytest test.py -v
```

## Challenge Extensions

Once you complete the basic version, try these:

1. **Add time-based greetings**: "Good morning, Alice!" or "Good evening, Bob!"
2. **Multiple greeting styles**: Add a second parameter for greeting type
3. **Validation**: Handle empty names or invalid inputs
4. **Personal touches**: Add random compliments to the greeting

## What You Learned

- ✅ Creating functions in Python
- ✅ Using function parameters
- ✅ String formatting with f-strings
- ✅ Running Python programs
- ✅ Python module system
- ✅ Basic testing with pytest
