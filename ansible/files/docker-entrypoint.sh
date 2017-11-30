#!/bin/bash
cd $HOME
source nvm/nvm.sh
cd {{ node_container_name }}
pm2-docker $HOME/service_state/app.json
