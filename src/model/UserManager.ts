import { User } from "./User";
import Peer from 'peerjs';

export class UserManager {
    public self: User | null = null;
    public other: User | null = null;

    public constructor() {
        this.connect();
    }

    private connect() {

        const peer = new Peer(undefined, {
            debug: 3
        });

        if (window.location.hash) {
            this.other = new User({id: window.location.hash.replace("#", "")});
            const conn = peer.connect(this.other.id, {
                reliable: true,
            });
            conn.on('open', () => {
                conn.send('hi!');
                conn.on('data', function(data) {
                    console.log('Received', data);
                });
            });
            conn.on('error', (e) => {
                console.error(e);
            });
        } else {
            peer.on('open', (id) => {
                this.self = new User({id});
                if (!window.location.hash) {
                    window.location.hash = id;
                }

            });
        }

        peer.on('connection', function (conn) {
            conn.on('data', function(data) {
                console.log('Received', data);
            });
        });
        peer.on('disconnected', function () {
            console.error('disconnected');
        });
        peer.on('close', function() {
            console.error('close');
        });
        peer.on('error', function (e) {
            console.error(e);
        });
        peer.on('data', function() {
            console.log("data");
        })

    }
}