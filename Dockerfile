FROM     ubuntu:16.04
MAINTAINER mateus [dot] m [dot] luna [at] gmail [dot] com

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_VERSION=8.4.0

# Install basics
RUN apt-get update &&  \
    apt-get install -y sudo git wget curl unzip && \

    curl --retry 3 -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" && \
    tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 && \
    rm "node-v$NODE_VERSION-linux-x64.tar.gz" && \
    npm install -g npm"$NPM_VERSION" 


EXPOSE 3000
