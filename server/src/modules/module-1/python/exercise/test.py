import pytest
import sys
import os

# Add the current directory to the path so we can import the main module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the main module
try:
    from tmp_main import greet_user
except ImportError:
    pytest.skip("Could not import greet_user function from tmp_main.py", allow_module_level=True)

class TestGreetingFunction:
    def test_greet_user_function_exists(self):
        """Test that greet_user function exists and is callable"""
        assert callable(greet_user), "greet_user should be a callable function"
    
    def test_greet_user_alice(self):
        """Test greeting for Alice"""
        result = greet_user("Alice")
        assert result == "Hello, Alice! Welcome to Python!"
    
    def test_greet_user_bob(self):
        """Test greeting for Bob"""
        result = greet_user("Bob")
        assert result == "Hello, Bob! Welcome to Python!"
    
    def test_greet_user_charlie(self):
        """Test greeting for Charlie"""
        result = greet_user("Charlie")
        assert result == "Hello, Charlie! Welcome to Python!"
    
    def test_greet_user_diana(self):
        """Test greeting for Diana"""
        result = greet_user("Diana")
        assert result == "Hello, Diana! Welcome to Python!"
    
    def test_greet_user_eve(self):
        """Test greeting for Eve"""
        result = greet_user("Eve")
        assert result == "Hello, Eve! Welcome to Python!"
    
    def test_greet_user_empty_string(self):
        """Test greeting for empty string"""
        result = greet_user("")
        assert result == "Hello, ! Welcome to Python!"
    
    def test_greet_user_special_characters(self):
        """Test greeting for name with special characters"""
        result = greet_user("John-Doe")
        assert result == "Hello, John-Doe! Welcome to Python!"
