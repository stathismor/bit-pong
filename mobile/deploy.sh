#!/bin/bash
rm -rf www/*
cp -rf ../deploy/* www/
cordova run
