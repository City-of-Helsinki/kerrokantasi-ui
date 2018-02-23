#!/bin/bash
cd $HOME
source nvm/nvm.sh
cd {{ deployment_name }}
pm2-docker $HOME/service_state/app.json
