# Module 1 Lab: Python Environment Setup & Basics

## Overview
This lab introduces you to the Python programming environment and fundamental concepts. You'll learn about Python's syntax, functions, modules, and basic operations.

## Learning Objectives
By the end of this lab, you will be able to:
- Set up a Python development environment
- Write and execute Python functions
- Understand Python's module system
- Use string formatting and basic operations
- Run tests using pytest

## Prerequisites
- Basic programming knowledge
- Understanding of functions and variables
- Access to a Python 3.7+ environment

## Lab Structure

### Part 1: Python Environment
- Python installation and setup
- Virtual environments
- Package management with pip

### Part 2: Python Basics
- Variables and data types
- Functions and parameters
- String formatting
- Module imports

### Part 3: Testing
- Introduction to pytest
- Writing test cases
- Running tests

## Key Concepts

### Functions in Python
```python
def function_name(parameter):
    """Function documentation"""
    return result
```

### String Formatting
```python
# f-string (recommended)
name = "Alice"
greeting = f"Hello, {name}!"

# .format() method
greeting = "Hello, {}!".format(name)

# % formatting (older style)
greeting = "Hello, %s!" % name
```

### Module System
```python
# Import entire module
import math

# Import specific function
from math import sqrt

# Import with alias
import numpy as np
```

## Resources
- [Python Official Documentation](https://docs.python.org/3/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Python String Formatting Guide](https://realpython.com/python-string-formatting/)

## Next Steps
After completing this lab, you'll be ready to move on to more advanced Python concepts like classes, error handling, and working with external libraries.
