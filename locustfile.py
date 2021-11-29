from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def hello_world(self):
        # response = self.client.post("/login", {"username":"testuser", "password":"secret"})
        # print("Response status code:", response.status_code)
        # print("Response text:", response.text)
        # response = self.client.get("/my-profile")
        self.client.get("/")
        # self.client.get("/list")