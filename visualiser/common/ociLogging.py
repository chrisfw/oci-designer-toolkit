#!/usr/bin/python

# Copyright (c) 2019  Oracle and/or its affiliates. All rights reserved.
# The Universal Permissive License (UPL), Version 1.0 [https://oss.oracle.com/licenses/upl/]

"""Provide Module Description
"""

# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
__author__ = ["Andrew Hopkinson (Oracle Cloud Solutions A-Team)"]
__version__ = "1.0.0.0"
__module__ = "ekitLogging"
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#


import logging
import logging.handlers
import os
import sys


logger = None
loglevelmap = {'critical': logging.CRITICAL, 'error': logging.ERROR, 'warning': logging.WARNING, 'info': logging.INFO,
               'debug': logging.DEBUG}

def getConsoleFormat():
    defaultformat = '%(levelname)s: %(message)s'
    return os.getenv('OCI_CONSOLE_LOG_FORMAT', defaultformat)


def getConsoleLogLevel():
    loglevel = os.getenv('OCI_CONSOLE_LOG_LEVEL', 'INFO')
    if loglevel.lower() in loglevelmap:
        return loglevelmap[loglevel.lower()]
    else:
        return logging.INFO


def getLogFilename():
    return os.getenv('OCI_LOGFILE', '/var/tmp/okit.log')


def getDebugLogFilename():
    return os.getenv('OCI_DEBUG_LOGFILE', getLogFilename().replace('.log', '-debug.log'))


def getFileFormat():
    defaultformat = '[UTC] %(asctime)-15s [%(process)s] (%(module)s-%(funcName)s-%(lineno)d) %(levelname)s: %(message)s'
    return os.getenv('OCI_LOG_FORMAT', defaultformat)


def getFileLogLevel():
    loglevel = os.getenv('OCI_LOG_LEVEL', 'INFO')
    if loglevel.lower() in loglevelmap:
        return loglevelmap[loglevel.lower()]
    else:
        return logging.DEBUG


def getLogger():
    global logger
    if logger is None:
        logger = logging.getLogger('')
        logger.setLevel(logging.NOTSET)
        # Console Log handler
        cloghandler = logging.StreamHandler(sys.stdout)
        cloghandler.setLevel(getConsoleLogLevel())
        cloghandler.setFormatter(logging.Formatter(getConsoleFormat()))
        logger.addHandler(cloghandler)
        # File log handler
        floghandler = logging.handlers.RotatingFileHandler(getLogFilename(), maxBytes=10485760, backupCount=10)
        floghandler.setLevel(getFileLogLevel())
        floghandler.setFormatter(logging.Formatter(getFileFormat()))
        logger.addHandler(floghandler)
        # File debug log handler
        dfloghandler = logging.handlers.RotatingFileHandler(getDebugLogFilename(), maxBytes=10485760, backupCount=10)
        dfloghandler.setLevel(logging.DEBUG)
        dfloghandler.setFormatter(logging.Formatter(getFileFormat()))
        logger.addHandler(dfloghandler)
    return logger



