#!/bin/bash
SCRIPT=${0##*/}
CMD=$1 
DEFAULT_IMAGE_NAME=dmitryvarennikov/cuegenerator
DEFAULT_IMAGE_LABEL=cuegenerator

function usage () {
  cat << EOF

usage: $SCRIPT <cmd>
  Help to run predefined Docker operations
  <cmd> arguments:
    build     build image
      build [<image-name>]
    run       run container
      run [<image-name>] [<image-label>]
    exec      interact with containers
      exec [<image-label>]
    logs      watch container logs
      logs [<image-label>]

NOTE:
  There are default <image-name> and <image-label> 
EOF
  exit $1
}

function build() {
  local IMAGE_NAME=${1:-$DEFAULT_IMAGE_NAME}
  echo "Building ${IMAGE_NAME} image"
  docker build -t ${IMAGE_NAME} .
}

function run() {
  local IMAGE_NAME=${1:-$DEFAULT_IMAGE_NAME}
  local IMAGE_LABEL=${2:-$DEFAULT_IMAGE_LABEL}

  stop "$IMAGE_LABEL"
  
  echo "Running $IMAGE_NAME image as $IMAGE_LABEL"
  docker run -d -P --name $IMAGE_LABEL $IMAGE_NAME
  docker port $IMAGE_LABEL
}

function stop() {
  local IMAGE_LABEL=${1:-$DEFAULT_IMAGE_LABEL}
  local CONTAINER_ID=$(docker ps -f name=$IMAGE_LABEL -qa)
  if [ ! -z "$CONTAINER_ID" ] ; then
    echo "Stoppping and removing container $CONTAINER_ID"
    docker stop $CONTAINER_ID 
    docker rm $CONTAINER_ID
  fi
}

function exec() {
  local IMAGE_LABEL=${1:-$DEFAULT_IMAGE_LABEL}
  docker exec -ti $IMAGE_LABEL bash
}

function logs() {
  local IMAGE_LABEL=${1:-$DEFAULT_IMAGE_LABEL}
  docker logs -f $IMAGE_LABEL
}

if [ "$CMD" = "build" ] ; then
    build "$2"
elif [ "$CMD" = "run" ] ; then
    run "$2" "$3"
elif [ "$CMD" = "stop" ] ; then
    stop "$2"
elif [ "$CMD" = "exec" ] ; then
    exec "$2"
elif [ "$CMD" = "logs" ] ; then
    logs "$2"
else
  usage
fi