# Step 1: Use an official Python runtime as a parent image
FROM python:slim

# Step 2: Install system dependencies including MariaDB Connector/C
RUN apt-get update && apt-get install -y \
    libmariadb-dev gcc && \
    apt-get clean


# Step 3: Set the working directory in the container
WORKDIR /app

# Step 4: Copy the current directory contents into the container at /app
COPY . /app

# Step 5: Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Make port 8080 available to the world outside this container
EXPOSE 8080

# Step 7: Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

# Step 8: Run Flask app when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]
