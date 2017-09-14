** Basic NodeJS CHAT SERVER RUNNING in DOCKER container.** 
##  Installation
**Pre-requisite**: Linux with docker installed

From your Linux prompt as `root` in the `/root` DIR:
```
git clone https://github.com/mpalitto/CHAT-SERVER.git 
cd CHAT-SERVER
```
* run `source docker.sh build` (which will build the docker image)

## Create the CONTAINER
Once the image whas created it is now time to use it for generating a container:

* `source docker.sh create`

NOTE: the container name is CHAT-SERVER

A shared DIR with your HOST will be created named ` CHAT-SERVER-code`
**Usefull commands:** 
* `docker container ls` for listing containers that are running
* `docker container ls -a` for listing all containers
* `docker start <CONTAINER name>` for starting an existing container
* `docker stop <CONTAINER name>` for stopping a running container
* `docker rm <CONTAINER name>` for deleting a container

NOTE: When the HOST computer gets turned OFF, and later on turned back ON, if a container was running, it won't be restarted automatically.
Use the `docker start <CONTAINER name>` for restarting it.
## Developing and Editing
Once the CONTAINER is running we can access to it running the following command:

* `source docker.sh enter` (to get a prompt inside the container)

Once you're inside your docker container and folder, you can follow usual workflow to a NodeJS project:

The code will be accessible from your HOST in the `/root/CHAT-SERVER/CHAT-SERVER-code/` DIR

TIP: I usually have a window opened with container prompt for running NodeJS commands, and a window with the HOST prompt in the `CHAT-SERVER-code` DIR for editing the code.

