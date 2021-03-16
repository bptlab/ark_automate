import requests
import time
import os
import json


def setup_new_session(local_client_id, user_id):
    response = requests.get(f"http://localhost:5000/sessions/new?lci={local_client_id}&userId={user_id}")
    try: 
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        return "Error: " + str(e)
    
    with open('./sessionId.txt', 'w') as file:
        session = json.loads(response.text)
        file.write(session["_id"])
    
    session_id = session["_id"]
    print(f"new session set up with session id {session_id}")

def get_user_id_from_session(session_id):
    response = requests.get(f"http://localhost:5000/sessions/{session_id}")
    try: 
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        return "Error: " + str(e)
    
    session = json.loads(response.text)
    return session["user_id"]

def print_logo():
    print("\n")
    print(" █████╗ ██████╗ ██╗  ██╗     █████╗ ██╗   ██╗████████╗ ██████╗ ███╗   ███╗ █████╗ ████████╗███████╗")
    print("██╔══██╗██╔══██╗██║ ██╔╝    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝██╔════╝")
    print("███████║██████╔╝█████╔╝     ███████║██║   ██║   ██║   ██║   ██║██╔████╔██║███████║   ██║   █████╗")
    print("██╔══██║██╔══██╗██╔═██╗     ██╔══██║██║   ██║   ██║   ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██╔══╝")
    print("██║  ██║██║  ██║██║  ██╗    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║ ╚═╝ ██║██║  ██║   ██║   ███████╗")
    print("╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝")
    print("\n")

def deleteLogs():
    if os.path.exists("./output.xml"):
        os.remove("./output.xml")
    if os.path.exists("./log.html"):
        os.remove("./log.html")
    if os.path.exists("./report.html"):
        os.remove("./report.html")
    if os.path.exists("./geckodriver-1.log"):
        os.remove("./geckodriver-1.log")

# returns a list of dictionaries, where each dictionary is a job
def getJobsForUser(user_id):
    response = requests.get(f"http://localhost:5000/jobs/user/{user_id}")
    try: 
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        return "Error: " + str(e)
    
    return json.loads(response.text)

def deleteJob(job_id):
    response = requests.delete(f"http://localhost:5000/jobs/{job_id}")
    try: 
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        return "Error: " + str(e)
    print(response.text)


with open('./localClientId.txt', 'r') as file:
    local_client_id = file.read()

with open('./sessionId.txt', 'r') as file:
    session_id = file.read()

print_logo()
print(f"Starting Client with client id: {local_client_id}")
print(f"Following sessionId was found: {session_id}")
new_session_requested = input("Do you want to start a new session? Type yes or no: ")

if(new_session_requested.lower() == "yes" or session_id == ''):
    user_id = input("Please enter your userId: ")
    setup_new_session(local_client_id, user_id)
else:
    user_id = get_user_id_from_session(session_id)

print(f"Client connection for user {user_id}")

while True:
    deleteLogs()
    jobsForUser = getJobsForUser(user_id)
    
    if (len(jobsForUser) > 0):
        for job in jobsForUser:
            robot_id = job["robot_id"]
            job_id = job["_id"]

            response = requests.get(f"http://localhost:5000/jobs/run/{robot_id}")
            try: 
                response.raise_for_status()
            except requests.exceptions.HTTPError as e:
                print("Error: " + str(e))
                continue
            if response.text == "No Bot found for id":
                continue

            with open('./executable.robot', 'w') as file:
                file.write(response.text)
            
            os.system('robot executable.robot')
            
            # if you also want to delete the request after running it uncomment the following line
            # deleteJob(job_id)
            
            time.sleep(10)
    else:
        print(f"Currently no pending jobs for user {user_id}")
        time.sleep(10)
    print("Fetching again...")
