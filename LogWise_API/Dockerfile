# Use an official Python image
FROM python:3.10.0

# Set the working directory inside the container
WORKDIR /LogWise_API

# Copy the Python script(s) to the working directory
COPY LogWise_API*.py ./

# Install dependencies
RUN pip install PyPDF2 openpyxl python-docx python-pptx ezodf pandas transformers torch scikit-learn flask flask-cors azure-storage-blob openai==0.28 matplotlib seaborn

# Expose the port the app runs on
EXPOSE 5000

# Start the Python application
CMD ["python", "LogWise_API.py"]