import {__PROD_ENV__} from './env.js';

export var flavor = {
  prod: false,
  dev: false
};


function buildFlavor() {
  flavor.dev = true;
  console.log("__PROD_ENV__", __PROD_ENV__);
  flavor.prod = (__PROD_ENV__ === true);
  flavor.dev = !flavor.prod;
  console.log('prod', flavor.prod);
  console.log('dev', flavor.dev);
};

buildFlavor();