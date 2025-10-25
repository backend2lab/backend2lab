# Solution: Greeting function implementation
# The function should:
# - Take a 'name' parameter
# - Return a greeting message like "Hello, [name]! Welcome to Python!"

def greet_user(name):
    return f"Hello, {name}! Welcome to Python!"

# Export the function so it can be used in other files
if __name__ == "__main__":
    # Test the function
    print(greet_user("Alice"))
    print(greet_user("Bob"))
    print(greet_user("Charlie"))
