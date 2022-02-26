import { Collection, Client, MessageEmbed, Options } from "discord.js";
import { config } from "./config";
import { handlers } from "./Util/Functions/handlers";
import Captain from "captainjs";
import login from "./Database/login";
import "./Typings";
import superagent from "superagent";
import {JsonDB} from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { cacheStructure } from './Util/constants/cache';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { allUtil } from "./Util/constants/evalUtil";
import * as redis from "redis";
const {version} = require('../package.json');

export const sentry = Sentry; 