import { launch } from './telegram';
import http from 'http';

launch();

setInterval(() => {
    http.get('http://easycalbot.herokuapp.com');
}, 900000);
