GITconfig="git config --global user.email your@email.com; git config --global user.name yourName"
GITconfig="git config --global user.email mpalitto@gmail.com; git config --global user.name Matteo"

APPname="$(pwd | sed 's_.*/__')"
APPdir="/root/$APPname/$APPname-code/"

case $1 in
	'build')
	docker build -t nodejs-image .
	;;

	'create')
	docker run -td --name $APPname -h $APPname -p 3000:3000 -v $APPdir:/root/$APPname -w /root/$APPname nodejs-image /bin/bash -c "$GITconfig; mv /root/package.json /root/$APPname/; mv /root/server.js /root/$APPname/; cd /root/$APPname;npm install sqlite3; npm install package.json --save-dev; while true; do sleep 99; done"
	;;

	'enter')
	docker exec -it $APPname /bin/bash
	;;

	*)
	echo 'Usage: source docker.sh <build|create|enter>'
esac	
