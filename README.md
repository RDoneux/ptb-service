# TPLT | Node Server

## Running the produced docker image on the target machine

- pull the docker image onto the target machine `docker pull <docker hub username>/<docker hub repository>:<project tag>`
- create a .env file which contains the desired environment variables. This just needs to be the directory from which you will run the docker run command, but it makes sense to put it into a project directory.
- run `docker images` to get the image id
- from the same directory as the .env file, run `docker run -d -p <external port>:<internal port> --env-file .env <image id>`
